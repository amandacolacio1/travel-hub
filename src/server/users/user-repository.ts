import "server-only";

import { prisma } from "@/server/db/prisma";

/** O e-mail é sempre gravado em minúsculas; a busca normaliza do mesmo jeito. */
export function findUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export function findUserById(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}

/** `preferencias.moeda` do usuário — base do câmbio. BRL se não houver. */
export async function findUserCurrency(usuarioId: string): Promise<string> {
  const preferencias = await prisma.preferencias.findUnique({
    where: { usuarioId },
    select: { moeda: true },
  });
  return preferencias?.moeda ?? "BRL";
}

export function updatePasswordHash(id: string, senhaHash: string) {
  return prisma.usuario.update({ where: { id }, data: { senhaHash } });
}
