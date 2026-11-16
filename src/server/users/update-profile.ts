import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { AtualizarSessaoPayload } from "@/features/auth/schemas/sessao.schema";
import type { Session } from "@/shared/session/session.types";
import { SESSION_INCLUDE, toPublicSession } from "@/server/auth/session-mapper";
import { prisma } from "@/server/db/prisma";
import { HttpError } from "@/server/http/http-error";
import {
  replaceInterests,
  syncTrips,
  toDbDate,
  toDbPerfilViagem,
} from "./profile-writes";

/** Mais folga que o padrão (5 s): em dev, cada query cruza o continente até o Neon. */
const TIMEOUT_TRANSACAO_MS = 15_000;

/**
 * Aplica o `PATCH /api/auth/session` numa transação só: ou tudo grava, ou
 * nada grava. Devolve a sessão já atualizada.
 */
export async function updateProfile(
  usuarioId: string,
  { usuario, perfilViagem, preferencias }: AtualizarSessaoPayload,
): Promise<Session> {
  const dadosPreferencias: Prisma.PreferenciasUpdateInput = {
    perfilViagem: perfilViagem && toDbPerfilViagem(perfilViagem),
    orcamentoMin: preferencias?.orcamentoInicial,
    orcamentoMax: preferencias?.orcamentoFinal,
    dataPrevista:
      preferencias?.dataPrevista === undefined
        ? undefined
        : toDbDate(preferencias.dataPrevista),
  };
  const temPreferencias = Object.values(dadosPreferencias).some(
    (valor) => valor !== undefined,
  );

  await prisma.$transaction(
    async (tx) => {
      if (usuario) {
        await tx.usuario.update({ where: { id: usuarioId }, data: usuario });
      }

      if (temPreferencias) {
        const salvas = await tx.preferencias.update({
          where: { usuarioId },
          data: dadosPreferencias,
        });
        // O schema só compara as duas pontas quando ambas vêm no patch; aqui
        // a regra vale também quando só uma delas mudou.
        if (Number(salvas.orcamentoMax) < Number(salvas.orcamentoMin)) {
          throw new HttpError(400, "O valor final deve ser maior ou igual ao inicial");
        }
      }

      if (preferencias?.interesses) {
        await replaceInterests(tx, usuarioId, preferencias.interesses);
      }

      if (preferencias?.destinos) {
        await syncTrips(tx, usuarioId, preferencias.destinos);
      }
    },
    { timeout: TIMEOUT_TRANSACAO_MS },
  );

  // Releitura fora da transação: o `include` dispara consultas em paralelo,
  // que dentro dela disputariam a mesma conexão (o `pg` avisa que isso deixa
  // de ser suportado na v9). Fora, cada uma usa uma conexão do pool.
  const atualizado = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    include: SESSION_INCLUDE,
  });

  return toPublicSession(atualizado);
}
