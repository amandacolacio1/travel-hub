"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTripPayload, UpdateTripPayload } from "../schemas/trip.schema";
import type { Trip } from "../types/trip";
import { createTrip, deleteTrip, fetchTrips, updateTrip } from "./trips.service";

export const TRIPS_QUERY_KEY = ["viagens"] as const;

/** Enquanto alguma ficha está sendo preparada, consulta de novo neste ritmo. */
const INTERVALO_ENQUANTO_PREPARA_MS = 2_000;

function preparandoFicha(viagens: Trip[] | undefined): boolean {
  return (viagens ?? []).some(({ destino }) =>
    ["pendente", "gerando"].includes(destino.fichaStatus),
  );
}

/**
 * "Meus destinos" do usuário logado (`GET /api/viagens`). Fichas novas são
 * geradas no servidor depois da resposta; até ficarem prontas, a lista se
 * atualiza sozinha.
 */
export function useTrips() {
  return useQuery({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: fetchTrips,
    refetchInterval: (query) =>
      preparandoFicha(query.state.data) ? INTERVALO_ENQUANTO_PREPARA_MS : false,
  });
}

/**
 * Sem update otimista: o id da viagem só existe depois que o servidor cria, e
 * o servidor pode recusar (limite de 4, destino repetido).
 */
export function useCreateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTripPayload) => createTrip(payload),
    onSuccess: (viagem) => {
      queryClient.setQueryData<Trip[]>(TRIPS_QUERY_KEY, (atual) =>
        atual ? [...atual, viagem] : [viagem],
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY }),
  });
}

/**
 * Aplica o patch na lista em cache antes da resposta; um callback recebe a
 * lista atual e devolve a nova. Em erro, volta ao que era.
 */
function useOptimisticTripsMutation<TVars>(
  mutationFn: (vars: TVars) => Promise<unknown>,
  aplicar: (lista: Trip[], vars: TVars) => Trip[],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (vars: TVars) => {
      await queryClient.cancelQueries({ queryKey: TRIPS_QUERY_KEY });
      const anterior = queryClient.getQueryData<Trip[]>(TRIPS_QUERY_KEY);
      if (anterior) {
        queryClient.setQueryData<Trip[]>(TRIPS_QUERY_KEY, aplicar(anterior, vars));
      }
      return { anterior };
    },
    onError: (_erro, _vars, context) => {
      if (context?.anterior) {
        queryClient.setQueryData(TRIPS_QUERY_KEY, context.anterior);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY }),
  });
}

export function useUpdateTripMutation() {
  return useOptimisticTripsMutation(
    ({ id, patch }: { id: string; patch: UpdateTripPayload }) => updateTrip(id, patch),
    (lista, { id, patch }) =>
      lista.map((viagem) => (viagem.id === id ? { ...viagem, ...patch } : viagem)),
  );
}

export function useDeleteTripMutation() {
  return useOptimisticTripsMutation(
    (id: string) => deleteTrip(id),
    (lista, id) => lista.filter((viagem) => viagem.id !== id),
  );
}
