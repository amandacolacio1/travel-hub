import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { DestinoResolvido } from "./resolve-destination";

/**
 * O "upsert" do PDF: procura em `destinos` por `codigo_pais + cidade` e cria
 * se não existir. Em linhas que já existem, completa moeda e bandeira — mas
 * nunca as apaga com `null`.
 *
 * @returns id do destino.
 */
export async function upsertDestination(
  tx: Prisma.TransactionClient,
  destino: DestinoResolvido,
): Promise<string> {
  const { id } = await tx.destino.upsert({
    where: {
      codigoPais_cidade: { codigoPais: destino.codigoPais, cidade: destino.cidade },
    },
    update: {
      bandeiraUrl: destino.bandeiraUrl,
      ...(destino.moeda && { moeda: destino.moeda }),
    },
    create: destino,
    select: { id: true },
  });
  return id;
}
