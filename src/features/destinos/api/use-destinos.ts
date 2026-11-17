"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSession } from "@/shared/session";
import { rankearDestinos } from "../utils/score";
import { ensureDestination, fetchDestinos } from "./destinos.service";
import { TRIPS_QUERY_KEY } from "./use-trips";

export const DESTINOS_QUERY_KEY = ["destinos"] as const;

const CINCO_MINUTOS = 5 * 60 * 1000;

/** Catálogo completo; muda raramente, então fica em cache por alguns minutos. */
export function useDestinos() {
  return useQuery({
    queryKey: DESTINOS_QUERY_KEY,
    queryFn: fetchDestinos,
    staleTime: CINCO_MINUTOS,
  });
}

/**
 * Prepara a ficha de uma cidade e atualiza o catálogo e as viagens (o status
 * da ficha aparece em "Meus destinos").
 */
export function useEnsureDestinationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ensureDestination,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: DESTINOS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY }),
      ]),
  });
}

export function useDestino(slug: string) {
  const query = useDestinos();
  const destino = query.data?.find((item) => item.slug === slug);

  return { ...query, destino };
}

/**
 * Catálogo ordenado pelas preferências da sessão. Junta os dois estados de
 * servidor (catálogo + sessão) para as telas não repetirem esse cálculo.
 */
export function useDestinosRanking() {
  const { data: destinos, ...catalogo } = useDestinos();
  const { session, isPending: carregandoSessao } = useSession();

  const ranking = useMemo(
    () => (destinos && session ? rankearDestinos(destinos, session) : []),
    [destinos, session],
  );

  return {
    destinos,
    ranking,
    session,
    isPending: catalogo.isPending || carregandoSessao,
    isError: catalogo.isError,
  };
}
