/**
 * Gera fichas de destinos com o gerador configurado em `AI_PROVIDER`.
 *
 *   npm run ai:profiles                       # cidades iniciais
 *   npm run ai:profiles -- "Paraty/RJ" "Olinda/PE"
 *   npm run ai:profiles -- --refazer          # gera de novo mesmo se pronta
 *
 * `--refazer` serve para trocar fichas de exemplo (gerador falso) pelas de
 * uma IA real. Fichas editoriais (escritas à mão) nunca são refeitas.
 */
import "dotenv/config";
import { prisma } from "@/server/db/prisma";
import { currentProfileSource } from "@/server/ai/generate-destination-profile";
import { ensureProfile } from "@/server/destinations/destination-catalog";
import { resolveDestination } from "@/server/destinations/resolve-destination";
import { upsertDestination } from "@/server/destinations/upsert-destination";

/** Destinos turísticos conhecidos, de todas as regiões, para o dashboard não começar vazio. */
const CIDADES_INICIAIS = [
  "Salvador/BA",
  "Florianópolis/SC",
  "Gramado/RS",
  "Bonito/MS",
  "Foz do Iguaçu/PR",
  "Ouro Preto/MG",
  "Manaus/AM",
  "Fortaleza/CE",
];

async function gerar(entrada: string, refazer: boolean) {
  const [cidade, uf] = entrada.split("/").map((parte) => parte.trim());
  if (!cidade || !uf) {
    console.error(`✖ ${entrada}: use o formato "Cidade/UF"`);
    return;
  }

  const destino = await resolveDestination(uf, cidade);
  if (!destino) {
    console.error(`✖ ${entrada}: cidade não encontrada no IBGE`);
    return;
  }

  await upsertDestination(prisma, destino);
  if (refazer) {
    await prisma.destino.updateMany({
      where: { slug: destino.slug, NOT: { fichaFonte: "editorial" } },
      data: { fichaStatus: "PENDENTE" },
    });
  }

  await ensureProfile(destino.slug);

  const { fichaStatus, fichaFonte } = await prisma.destino.findUniqueOrThrow({
    where: { slug: destino.slug },
  });
  const simbolo = fichaStatus === "PRONTA" ? "✔" : "✖";
  console.log(`${simbolo} ${destino.cidade}/${destino.uf}: ${fichaStatus} (${fichaFonte ?? "-"})`);
}

async function main() {
  const argumentos = process.argv.slice(2);
  const refazer = argumentos.includes("--refazer");
  const cidades = argumentos.filter((arg) => !arg.startsWith("--"));

  console.log(`Gerador: ${currentProfileSource()}`);
  for (const entrada of cidades.length > 0 ? cidades : CIDADES_INICIAIS) {
    await gerar(entrada, refazer);
  }
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
