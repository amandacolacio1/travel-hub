import "server-only";

import type { PerfilViagem as PerfilViagemDb, Prisma } from "@/generated/prisma/client";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado, PerfilViagem } from "@/features/auth/types/auth";
import {
  type DestinoResolvido,
  resolveDestinationOrThrow,
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
 * Confere no IBGE os destinos que o front enviou (linhas sem cidade são
 * ignoradas) e aplica o limite. Faz chamadas de rede: rode antes da transação.
 */
export async function resolveDesiredDestinations(
  destinos: DestinoDesejado[],
): Promise<DestinoResolvido[]> {
  const preenchidos = destinos.filter(({ uf, cidade }) => uf.trim() && cidade.trim());
  const resolvidos = await Promise.all(
    preenchidos.map(({ uf, cidade }) => resolveDestinationOrThrow(uf, cidade)),
  );

  // Mesma cidade duas vezes conta uma só.
  const unicos = [...new Map(resolvidos.map((d) => [d.ibgeId, d])).values()];

  // Regra do servidor, não só da tela: o front pode ser burlado.
  if (unicos.length > MAX_DESTINATIONS) {
    throw new HttpError(422, `Você pode salvar até ${MAX_DESTINATIONS} destinos.`);
  }

  return unicos;
}

/**
 * Faz a tabela `viagens` refletir a lista de destinos: cria as que entraram
 * (com upsert em `destinos`) e apaga as que saíram. As que já existiam ficam
 * intactas, preservando status e data de criação.
 */
export async function syncTrips(
  tx: Tx,
  usuarioId: string,
  destinos: DestinoResolvido[],
) {
  const destinoIds: string[] = [];
  for (const destino of destinos) {
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
