import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { PerfilViagem } from "@/features/auth/types/auth";
import type { Session } from "@/shared/session/session.types";

/** Tudo o que a sessão precisa, num único `include`. */
export const SESSION_INCLUDE = {
  preferencias: true,
} satisfies Prisma.UsuarioInclude;

export type UsuarioComSessao = Prisma.UsuarioGetPayload<{
  include: typeof SESSION_INCLUDE;
}>;

/**
 * Único ponto de tradução banco → contrato do front. O banco usa `SOZINHO`,
 * `Decimal` e `Date`; o front espera `"sozinho"`, `number` e `"2026-12-01"`.
 */
export function toPublicSession(usuario: UsuarioComSessao): Session {
  const preferencias = usuario.preferencias;

  return {
    usuario: {
      nome: usuario.nome,
      email: usuario.email,
      fotoUrl: usuario.fotoUrl,
      pais: usuario.pais,
      cidade: usuario.cidade,
    },
    preferencias: {
      interesses: preferencias?.interesses ?? [],
      orcamentoInicial: Number(preferencias?.orcamentoMin ?? 0),
      orcamentoFinal: Number(preferencias?.orcamentoMax ?? 0),
      // `@db.Date` volta como meia-noite UTC: os 10 primeiros caracteres são a data.
      dataPrevista: preferencias?.dataPrevista?.toISOString().slice(0, 10) ?? "",
    },
    perfilViagem: (preferencias?.perfilViagem ?? "SOZINHO").toLowerCase() as PerfilViagem,
  };
}
