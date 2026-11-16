"use client";

import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado } from "@/features/auth/types/auth";
import { useUpdatePreferenciasMutation } from "@/shared/session";
import { useDestinosRanking } from "../api/use-destinos";
import type { Destino } from "../types/destino";
import { encontrarDestino, mesmoDestino } from "../utils/catalogo";

export const MAX_DESTINOS_SALVOS = MAX_DESTINATIONS;

function paraDesejado({ pais, cidade }: Destino): DestinoDesejado {
  return { pais, cidade };
}

/**
 * Lista de destinos desejados do usuário (guardada na sessão), cruzada com o
 * catálogo. Destinos escolhidos no cadastro que não existem no catálogo
 * continuam na lista, só que sem detalhes (`destino` indefinido).
 */
export function useMeusDestinos() {
  const dados = useDestinosRanking();
  const preferencias = useUpdatePreferenciasMutation();

  const desejados = dados.session?.preferencias.destinos ?? [];
  const catalogo = dados.destinos ?? [];

  const itens = desejados.map((desejado) => ({
    desejado,
    destino: encontrarDestino(catalogo, desejado),
  }));

  const naoSalvos = dados.ranking.filter(
    ({ destino }) =>
      !desejados.some((desejado) => mesmoDestino(desejado, paraDesejado(destino))),
  );

  return {
    isPending: dados.isPending,
    isError: dados.isError,
    perfilViagem: dados.session?.perfilViagem,
    catalogo,
    itens,
    /** Ranking sem os destinos que o usuário já salvou. */
    sugestoes: naoSalvos,
    cheio: desejados.length >= MAX_DESTINOS_SALVOS,
    adicionar: (destino: Destino) => {
      if (desejados.length >= MAX_DESTINOS_SALVOS) return;
      preferencias.mutate({ destinos: [...desejados, paraDesejado(destino)] });
    },
    remover: (alvo: DestinoDesejado) =>
      preferencias.mutate({
        destinos: desejados.filter((desejado) => !mesmoDestino(desejado, alvo)),
      }),
  };
}
