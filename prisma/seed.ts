/**
 * Popula o banco com os dados fixos. Idempotente: pode rodar quantas vezes
 * quiser (`npm run db:seed`), porque tudo é `upsert`.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { INTERESTS } from "../src/features/auth/constants/interests";
import { rioDeJaneiro } from "./seed-data/rio-de-janeiro";

/** Código do município do Rio de Janeiro no IBGE. */
const RIO_DE_JANEIRO_IBGE = 3304557;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

/**
 * Usuário de demonstração — o mesmo de `src/server/auth/usuarios-mock.ts`,
 * para o login continuar funcionando quando a rota passar a ler do banco.
 * Senha: `12345678`.
 */
const USUARIO_DEMO = {
  nome: "Amanda",
  email: "amanda@travelhub.com",
  senhaHash:
    "a153efe21ca65f752dfaa4764d12dc73:1ba8beee4ca2c120bfad0dfce3d8865910ba9ae2cb4a802bee0db426f748f23dc223bfdacc2041368f18d657a3ec8d8d496d73e529792e9087c3e24f49b26f24",
};

async function semearInteresses() {
  for (const interesse of INTERESTS) {
    await prisma.interesse.upsert({
      where: { slug: interesse.id },
      update: { nome: interesse.titulo, icone: interesse.icon },
      create: {
        slug: interesse.id,
        nome: interesse.titulo,
        icone: interesse.icon,
      },
    });
  }
  console.log(`✔ ${INTERESTS.length} interesses`);
}

async function semearUsuarioDemo() {
  const usuario = await prisma.usuario.upsert({
    where: { email: USUARIO_DEMO.email },
    update: {},
    create: {
      ...USUARIO_DEMO,
      preferencias: {
        create: {
          perfilViagem: "SOZINHO",
          orcamentoMin: 5000,
          orcamentoMax: 12000,
          interesses: ["natureza", "cultura"],
        },
      },
    },
  });

  console.log(`✔ usuário demo ${usuario.email}`);
}

/**
 * Ficha editorial (escrita à mão) do Rio de Janeiro, já pronta. As fichas das
 * outras cidades vêm do gerador: `npm run ai:profiles`.
 */
async function semearRioDeJaneiro() {
  const { slug, cidade, uf, estado, regiao, ...ficha } = rioDeJaneiro;
  const dados = {
    cidade,
    uf,
    estado,
    regiao,
    ficha,
    fichaStatus: "PRONTA" as const,
    fichaFonte: "editorial",
    fichaAtualizadaEm: new Date(),
  };

  await prisma.destino.upsert({
    where: { slug },
    update: dados,
    create: { ...dados, slug, ibgeId: RIO_DE_JANEIRO_IBGE },
  });
  console.log(`✔ ficha editorial ${cidade}`);
}

async function main() {
  await semearInteresses();
  await semearUsuarioDemo();
  await semearRioDeJaneiro();
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
