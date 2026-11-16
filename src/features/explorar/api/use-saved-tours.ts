"use client";

import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSavedTours, saveTour, unsaveTour } from "./saved-tours.service";

export const SAVED_TOURS_QUERY_KEY = ["passeios-salvos"] as const;
const TOGGLE_MUTATION_KEY = ["passeios-salvos", "alternar"] as const;

type ToggleVars = { apiId: string; salvar: boolean };

/** Passeios com ♡ do usuário (`GET /api/passeios-salvos`). */
export function useSavedTours() {
  return useQuery({ queryKey: SAVED_TOURS_QUERY_KEY, queryFn: fetchSavedTours });
}

/**
 * Liga/desliga o ♡. Devolver a promessa do `invalidateQueries` no
 * `onSettled` mantém a mutation "pendente" até a lista nova chegar — assim o
 * coração não pisca de volta entre a resposta e o refetch.
 */
export function useToggleSavedTourMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: TOGGLE_MUTATION_KEY,
    mutationFn: ({ apiId, salvar }: ToggleVars) =>
      salvar ? saveTour(apiId) : unsaveTour(apiId),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: SAVED_TOURS_QUERY_KEY }),
  });
}

/**
 * Ids salvos já com os cliques em andamento aplicados: UI otimista sem mexer
 * no cache. Se o servidor recusar, o clique sai da lista de pendentes e o
 * coração volta sozinho ao estado real.
 */
export function useSavedTourIds(): Set<string> {
  const { data } = useSavedTours();
  const pendentes = useMutationState({
    filters: { mutationKey: TOGGLE_MUTATION_KEY, status: "pending" },
    select: (mutation) => mutation.state.variables as ToggleVars,
  });

  return useMemo(() => {
    const ids = new Set(data?.map((tour) => tour.apiId));
    for (const { apiId, salvar } of pendentes) {
      if (salvar) ids.add(apiId);
      else ids.delete(apiId);
    }
    return ids;
  }, [data, pendentes]);
}
