"use client";

import { useQuery } from "@tanstack/react-query";
import { UnauthorizedError, fetchSession } from "./session.service";

/** Chave única da sessão — importada por quem precisa invalidar o cache. */
export const SESSION_QUERY_KEY = ["session"] as const;

/**
 * Fonte única da verdade sobre "quem está logado". Dashboard, header e guarda
 * de rota leem daqui; ninguém duplica esse dado em Zustand.
 */
export function useSession() {
  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
  });

  const naoAutenticado = query.error instanceof UnauthorizedError;

  return {
    ...query,
    session: query.data,
    /** `true` só quando a busca terminou e confirmou que não há sessão. */
    naoAutenticado,
  };
}
