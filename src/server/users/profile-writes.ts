import "server-only";

import type { PerfilViagem as PerfilViagemDb, Prisma } from "@/generated/prisma/client";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado, PerfilViagem } from "@/features/auth/types/auth";
import {
  type DestinoResolvido,
  resolveDestination,
} from "@/server/destinations/resolve-destination";
import { upsertDestination } from "@/server/destinations/upsert-destination";
import { HttpError } from "@/server/http/http-error";

type Tx = Prisma.TransactionClient;

const PERFIL_NO_BANCO = {
  sozinho: "SOZINHO",
  casal: "CASAL",
  familia: "FAMILIA",
} as const satisfies Record<PerfilViagem, PerfilViagemDb>;

export function toDbPerfilViagem(perfil: PerfilViagem): PerfilViagemDb {
  return PERFIL_NO_BANCO[perfil];
}

/** `"2026-12-01"` → `Date` em UTC; string vazia → sem data. */
export function toDbDate(data: string): Date | null {
  return data ? new Date(`${data}T00:00:00.000Z`) : null;
}

/** Substitui os interesses do usuário. Slugs desconhecidos são ignorados. */
export async function replaceInterests(tx: Tx, usuarioId: string, slugs: string[]) {
  const interesses = await tx.interesse.findMany({
    where: { slug: { in: slugs } },
    select: { id: true },
  });

  await tx.usuarioInteresse.deleteMany({ where: { usuarioId } });
  await tx.usuarioInteresse.createMany({
    data: interesses.map(({ id }) => ({ usuarioId, interesseId: id })),
  });
}

/**
 * Faz a tabela `viagens` refletir a lista `destinos` da sessão: cria as que
 * entraram (com upsert em `destinos`) e apaga as que saíram. As que já
 * existiam ficam intactas, preservando status e data de criação.
 */
export async function syncTrips(
  tx: Tx,
  usuarioId: string,
  destinos: DestinoDesejado[],
) {
  const resolvidos = new Map<string, DestinoResolvido>();

  for (const { pais, cidade } of destinos) {
    // O wizard começa com uma linha "Brasil / (vazio)"; linha sem cidade não é destino.
    if (!cidade.trim()) continue;

    const destino = resolveDestination(pais, cidade);
    if (!destino) throw new HttpError(400, `País não reconhecido: ${pais}`);

    resolvidos.set(`${destino.codigoPais}:${destino.cidade}`, destino);
  }

  // Regra do servidor, não só da tela: o front pode ser burlado.
  if (resolvidos.size > MAX_DESTINATIONS) {
    throw new HttpError(422, `Você pode salvar até ${MAX_DESTINATIONS} destinos.`);
  }

  const destinoIds: string[] = [];
  for (const destino of resolvidos.values()) {
    destinoIds.push(await upsertDestination(tx, destino));
  }

  await tx.viagem.deleteMany({
    where: { usuarioId, destinoId: { notIn: destinoIds } },
  });

  // `criadoEm` explícito e crescente: dentro de uma transação o "agora" é o
  // mesmo para todas as linhas, e a ordem da lista se perderia.
  const agora = Date.now();
  await tx.viagem.createMany({
    data: destinoIds.map((destinoId, indice) => ({
      usuarioId,
      destinoId,
      criadoEm: new Date(agora + indice),
    })),
    skipDuplicates: true,
  });
}
