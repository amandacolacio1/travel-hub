"use client";

import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado } from "@/features/auth/types/auth";
import { useDestinosRanking } from "../api/use-destinos";
import {
  useCreateTripMutation,
  useDeleteTripMutation,
  useTrips,
  useUpdateTripMutation,
} from "../api/use-trips";
import type { Trip, TripStatus } from "../types/trip";
import { encontrarDestino, mesmoDestino } from "../utils/catalogo";

/** Limite de viagens com status "planejando" (regra do servidor, espelhada aqui). */
export const MAX_DESTINOS_SALVOS = MAX_DESTINATIONS;

/**
 * Viagens do usuário (`/api/viagens`) cruzadas com o catálogo. Destinos
 * salvos que não existem no catálogo continuam na lista, só que sem detalhes
 * (`destino` indefinido).
 */
export function useMeusDestinos() {
  const dados = useDestinosRanking();
  const viagens = useTrips();
  const criar = useCreateTripMutation();
  const atualizar = useUpdateTripMutation();
  const excluir = useDeleteTripMutation();

  const lista = viagens.data ?? [];
  const catalogo = dados.destinos ?? [];

  const itens = lista.map((viagem) => ({
    viagem,
    destino: encontrarDestino(catalogo, viagem.destino),
  }));

  const naoSalvos = dados.ranking.filter(
    ({ destino }) => !lista.some((viagem) => mesmoDestino(viagem.destino, destino)),
  );

  const planejando = lista.filter((viagem) => viagem.status === "planejando").length;
  const cheio = planejando >= MAX_DESTINOS_SALVOS;

  /** Uma ação nova apaga o erro da anterior, para a mensagem não ficar velha. */
  function limparErros() {
    criar.reset();
    atualizar.reset();
    excluir.reset();
  }

  return {
    isPending: dados.isPending || viagens.isPending,
    isError: dados.isError || viagens.isError,
    perfilViagem: dados.session?.perfilViagem,
    catalogo,
    itens,
    /** Ranking sem os destinos que o usuário já salvou. */
    sugestoes: naoSalvos,
    vagas: Math.max(0, MAX_DESTINOS_SALVOS - planejando),
    cheio,
    /** Recusa do servidor na última ação (limite, destino repetido…). */
    erro: (criar.error ?? atualizar.error ?? excluir.error)?.message,
    adicionar: ({ uf, cidade }: DestinoDesejado) => {
      if (cheio) return;
      limparErros();
      criar.mutate({ uf, cidade });
    },
    mudarStatus: (viagem: Trip, status: TripStatus) => {
      limparErros();
      atualizar.mutate({ id: viagem.id, patch: { status } });
    },
    remover: (viagem: Trip) => {
      limparErros();
      excluir.mutate(viagem.id);
    },
  };
}
