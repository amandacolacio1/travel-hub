import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { DestinoResolvido } from "./resolve-destination";

/**
 * O "upsert" do PDF: procura em `destinos` pelo código IBGE do município e
 * cria se não existir. Linhas existentes não mudam — coordenadas e ficha são
 * preenchidas por quem as busca.
 *
 * @returns id do destino.
 */
export async function upsertDestination(
  tx: Prisma.TransactionClient,
  destino: DestinoResolvido,
): Promise<string> {
  const { id } = await tx.destino.upsert({
    where: { ibgeId: destino.ibgeId },
    update: {},
    create: destino,
    select: { id: true },
  });
  return id;
}
