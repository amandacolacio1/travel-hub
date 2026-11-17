import "server-only";

import type { RegisterPayload } from "@/features/auth/schemas/register.schema";
import { gerarHashDeSenha } from "@/server/auth/senha";
import { prisma } from "@/server/db/prisma";
import {
  replaceInterests,
  resolveDesiredDestinations,
  syncTrips,
  toDbDate,
  toDbPerfilViagem,
} from "./profile-writes";

const TIMEOUT_TRANSACAO_MS = 15_000;

/**
 * Cria usuário, preferências, interesses e viagens de uma vez. Se qualquer
 * parte falhar (e-mail repetido, cidade inválida…), nada fica gravado — não
 * sobra "meio usuário" no banco.
 *
 * @returns id do usuário criado.
 */
export async function registerUser({
  conta,
  preferencias,
  perfilViagem,
}: RegisterPayload): Promise<string> {
  // Hash fora da transação: o scrypt é lento de propósito, e transação boa é
  // transação curta.
  // Rede (IBGE) também fica fora: a cidade é conferida antes de abrir a transação.
  const [senhaHash, destinos] = await Promise.all([
    gerarHashDeSenha(conta.senha),
    resolveDesiredDestinations(preferencias.destinos),
  ]);

  return prisma.$transaction(
    async (tx) => {
      const { id } = await tx.usuario.create({
        data: {
          nome: conta.nome,
          email: conta.email,
          senhaHash,
          preferencias: {
            create: {
              perfilViagem: toDbPerfilViagem(perfilViagem),
              orcamentoMin: preferencias.orcamentoInicial,
              orcamentoMax: preferencias.orcamentoFinal,
              dataPrevista: toDbDate(preferencias.dataPrevista),
            },
          },
        },
        select: { id: true },
      });

      await replaceInterests(tx, id, preferencias.interesses);
      await syncTrips(tx, id, destinos);

      return id;
    },
    { timeout: TIMEOUT_TRANSACAO_MS },
  );
}
