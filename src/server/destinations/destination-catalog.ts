import "server-only";

import type { Destino as DestinoDb, Prisma } from "@/generated/prisma/client";
import type { Destino } from "@/features/destinos/types/destino";
import type { DestinationProfile } from "@/server/ai/destination-profile.schema";
import { generateDestinationProfile } from "@/server/ai/generate-destination-profile";
import { prisma } from "@/server/db/prisma";

/** Um GERANDO mais velho que isso é dado como travado (servidor caiu no meio). */
const GERACAO_TRAVADA_APOS_MS = 3 * 60 * 1000;
/** Quanto quem pediu a ficha "na hora" espera outra requisição terminar. */
const ESPERA_MAXIMA_MS = 60 * 1000;
const INTERVALO_DE_CONSULTA_MS = 1_000;

/** Destino do banco + ficha pronta → o `Destino` que o front conhece. */
function toCatalogDestination(linha: DestinoDb): Destino | null {
  if (linha.fichaStatus !== "PRONTA" || !linha.ficha) return null;

  // A ficha foi validada pelo schema antes de ser gravada.
  const ficha = linha.ficha as unknown as DestinationProfile;
  return {
    ...ficha,
    slug: linha.slug,
    cidade: linha.cidade,
    uf: linha.uf,
    estado: linha.estado,
    regiao: linha.regiao,
  };
}

/** Catálogo = destinos com ficha pronta. Cresce conforme os usuários escolhem cidades. */
export async function listCatalog(): Promise<Destino[]> {
  const linhas = await prisma.destino.findMany({
    where: { fichaStatus: "PRONTA" },
    orderBy: { cidade: "asc" },
  });
  return linhas.flatMap((linha) => toCatalogDestination(linha) ?? []);
}

export async function findCatalogDestination(slug: string): Promise<Destino | null> {
  const linha = await prisma.destino.findUnique({ where: { slug } });
  return linha ? toCatalogDestination(linha) : null;
}

/**
 * Marca o destino como GERANDO se ninguém estiver gerando. É um `UPDATE …
 * WHERE` atômico: de duas requisições simultâneas, só uma muda a linha — a
 * outra recebe `false` e não gera a ficha de novo.
 */
async function reservarGeracao(slug: string): Promise<boolean> {
  const agora = new Date();
  const { count } = await prisma.destino.updateMany({
    where: {
      slug,
      OR: [
        { fichaStatus: { in: ["PENDENTE", "ERRO"] } },
        {
          fichaStatus: "GERANDO",
          fichaAtualizadaEm: { lt: new Date(agora.getTime() - GERACAO_TRAVADA_APOS_MS) },
        },
      ],
    },
    data: { fichaStatus: "GERANDO", fichaAtualizadaEm: agora },
  });
  return count === 1;
}

/**
 * Gera e grava a ficha do destino, se ainda não houver uma (nem outra
 * geração em andamento). Nunca lança: falha vira status ERRO, que pode ser
 * tentado de novo — seguro para rodar em segundo plano (`after()`).
 */
export async function ensureProfile(slug: string): Promise<void> {
  if (!(await reservarGeracao(slug))) return;

  const linha = await prisma.destino.findUniqueOrThrow({ where: { slug } });

  try {
    const { ficha, fonte } = await generateDestinationProfile(linha);
    await prisma.destino.update({
      where: { slug },
      data: {
        ficha: ficha as unknown as Prisma.InputJsonObject,
        fichaFonte: fonte,
        fichaStatus: "PRONTA",
        fichaAtualizadaEm: new Date(),
      },
    });
  } catch (erro) {
    console.error(`[ficha] falhou para ${slug}`, erro);
    await prisma.destino.update({
      where: { slug },
      data: { fichaStatus: "ERRO", fichaAtualizadaEm: new Date() },
    });
  }
}

/**
 * Como `ensureProfile`, mas espera a ficha ficar pronta (inclusive quando é
 * outra requisição que está gerando).
 *
 * @returns o destino do catálogo, ou `null` se deu erro ou demorou demais.
 */
export async function ensureProfileAndWait(slug: string): Promise<Destino | null> {
  await ensureProfile(slug);

  const limite = Date.now() + ESPERA_MAXIMA_MS;
  for (;;) {
    const linha = await prisma.destino.findUnique({ where: { slug } });
    if (!linha || linha.fichaStatus === "ERRO") return null;
    if (linha.fichaStatus === "PRONTA") return toCatalogDestination(linha);
    if (Date.now() > limite) return null;
    await new Promise((resolve) => setTimeout(resolve, INTERVALO_DE_CONSULTA_MS));
  }
}

/** Gera, uma de cada vez, as fichas que faltam nos destinos do usuário. */
export async function ensureProfilesForUser(usuarioId: string): Promise<void> {
  const pendentes = await prisma.destino.findMany({
    where: {
      viagens: { some: { usuarioId } },
      fichaStatus: { in: ["PENDENTE", "ERRO"] },
    },
    select: { slug: true },
  });
  for (const { slug } of pendentes) {
    await ensureProfile(slug);
  }
}
