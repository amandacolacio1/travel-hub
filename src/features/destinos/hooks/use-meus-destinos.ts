"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado } from "@/features/auth/types/auth";
import {
  DESTINOS_QUERY_KEY,
  useDestinosRanking,
  useEnsureDestinationMutation,
} from "../api/use-destinos";
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
 * Viagens do usuário (`/api/viagens`) cruzadas com o catálogo. Enquanto a
 * ficha de uma cidade é preparada, ela continua na lista sem detalhes
 * (`destino` indefinido) e o card mostra o andamento.
 */
export function useMeusDestinos() {
  const queryClient = useQueryClient();
  const dados = useDestinosRanking();
  const viagens = useTrips();
  const criar = useCreateTripMutation();
  const atualizar = useUpdateTripMutation();
  const excluir = useDeleteTripMutation();
  const preparar = useEnsureDestinationMutation();

  const lista = viagens.data ?? [];
  const catalogo = dados.destinos ?? [];

  const itens = lista.map((viagem) => ({
    viagem,
    destino: encontrarDestino(catalogo, viagem.destino),
  }));

  // Ficha ficou pronta no servidor, mas o catálogo em cache é de antes: recarrega.
  const catalogoDesatualizado = itens.some(
    ({ viagem, destino }) => viagem.destino.fichaStatus === "pronta" && !destino,
  );
  useEffect(() => {
    if (catalogoDesatualizado) {
      queryClient.invalidateQueries({ queryKey: DESTINOS_QUERY_KEY });
    }
  }, [catalogoDesatualizado, queryClient]);

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
    preparar.reset();
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
    erro: (criar.error ?? atualizar.error ?? excluir.error ?? preparar.error)?.message,
    /** Viagem cuja ficha está sendo preparada a pedido do usuário ("Tentar de novo"). */
    preparando: preparar.isPending ? preparar.variables : undefined,
    adicionar: ({ uf, cidade }: DestinoDesejado) => {
      if (cheio) return;
      limparErros();
      criar.mutate({ uf, cidade });
    },
    mudarStatus: (viagem: Trip, status: TripStatus) => {
      limparErros();
      atualizar.mutate({ id: viagem.id, patch: { status } });
    },
    /** Nova tentativa de gerar a ficha, depois de um erro. */
    tentarDeNovo: (viagem: Trip) => {
      limparErros();
      preparar.mutate({ uf: viagem.destino.uf, cidade: viagem.destino.cidade });
    },
    remover: (viagem: Trip) => {
      limparErros();
      excluir.mutate(viagem.id);
    },
  };
}
