import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { Destino, Experiencia } from "@/features/destinos/types/destino";
import type { SavedTour } from "@/features/explorar/types/saved-tour";
import { prisma } from "@/server/db/prisma";
import { resolveDestination } from "@/server/destinations/resolve-destination";
import { upsertDestination } from "@/server/destinations/upsert-destination";
import { listarDestinos } from "@/server/destinos/catalogo";
import { HttpError } from "@/server/http/http-error";

const SAVED_TOUR_INCLUDE = {
  passeio: { include: { destino: true } },
} satisfies Prisma.PasseioSalvoInclude;

type SalvoCompleto = Prisma.PasseioSalvoGetPayload<{
  include: typeof SAVED_TOUR_INCLUDE;
}>;

function toPublicSavedTour({ passeio, criadoEm }: SalvoCompleto): SavedTour {
  return {
    apiId: passeio.apiId,
    titulo: passeio.titulo,
    descricao: passeio.descricao,
    categoria: passeio.categoria,
    preco: Number(passeio.preco),
    moeda: passeio.destino.moeda,
    imagemUrl: passeio.imagemUrl,
    destino: {
      codigoPais: passeio.destino.codigoPais,
      pais: passeio.destino.pais,
      cidade: passeio.destino.cidade,
    },
    salvoEm: criadoEm.toISOString(),
  };
}

/**
 * A "API de passeios" ainda não foi definida; até lá, a fonte é o catálogo
 * editorial e o `apiId` é o id da experiência. Quando a API entrar, só esta
 * função muda (passa a buscar na API pelo id).
 */
function buscarNaFonte(
  apiId: string,
): { experiencia: Experiencia; destino: Destino } | null {
  for (const destino of listarDestinos()) {
    const experiencia = destino.experiencias.find((item) => item.id === apiId);
    if (experiencia) return { experiencia, destino };
  }
  return null;
}

export async function listSavedTours(usuarioId: string): Promise<SavedTour[]> {
  const salvos = await prisma.passeioSalvo.findMany({
    where: { usuarioId },
    include: SAVED_TOUR_INCLUDE,
    orderBy: { criadoEm: "desc" },
  });
  return salvos.map(toPublicSavedTour);
}

/**
 * "Salvar um passeio" do PDF: upsert em `destinos` e `passeios` (cópias
 * compartilhadas) + linha em `passeios_salvos`. Idempotente: salvar duas
 * vezes não dá erro, porque o ♡ pode ser clicado rápido demais.
 *
 * Título, preço etc. vêm da fonte, nunca do corpo da requisição — senão
 * qualquer pessoa gravaria o preço que quisesse.
 */
export async function saveTour(usuarioId: string, apiId: string): Promise<SavedTour> {
  const fonte = buscarNaFonte(apiId);
  if (!fonte) throw new HttpError(404, "Passeio não encontrado");

  const { experiencia, destino } = fonte;
  // O destino do catálogo é sempre conhecido; `!` documenta essa garantia.
  const destinoResolvido = resolveDestination(destino.pais, destino.cidade)!;
  const dadosDoPasseio = {
    titulo: experiencia.titulo,
    descricao: experiencia.descricao,
    categoria: experiencia.categoria,
    preco: experiencia.preco,
    imagemUrl: experiencia.imagem ?? destino.imagem,
  };

  await prisma.$transaction(async (tx) => {
    const destinoId = await upsertDestination(tx, destinoResolvido);

    // A cópia é atualizada a cada novo salvamento: fica tão fresca quanto a fonte.
    const { id: passeioId } = await tx.passeio.upsert({
      where: { apiId },
      update: { ...dadosDoPasseio, destinoId },
      create: { ...dadosDoPasseio, apiId, destinoId },
      select: { id: true },
    });

    await tx.passeioSalvo.createMany({
      data: [{ usuarioId, passeioId }],
      skipDuplicates: true,
    });
  });

  const salvo = await prisma.passeioSalvo.findFirstOrThrow({
    where: { usuarioId, passeio: { apiId } },
    include: SAVED_TOUR_INCLUDE,
  });
  return toPublicSavedTour(salvo);
}

/**
 * Clicar no ♡ de novo apaga só a linha de `passeios_salvos`; a cópia em
 * `passeios` fica para os outros usuários. Idempotente, como o salvar.
 */
export async function unsaveTour(usuarioId: string, apiId: string): Promise<void> {
  await prisma.passeioSalvo.deleteMany({
    where: { usuarioId, passeio: { apiId } },
  });
}
