"use client";

import { useMemo } from "react";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import { useDestinosRanking } from "@/features/destinos/api/use-destinos";
import { useComparadorStore } from "../store/use-comparador-store";

export const MAX_COMPARADOR = MAX_DESTINATIONS;
const SELECAO_INICIAL = 3;

/** Destinos em comparação (com score), mais as ações de adicionar e remover. */
export function useComparador() {
  const dados = useDestinosRanking();
  const slugsEscolhidos = useComparadorStore((state) => state.slugs);
  const setSlugs = useComparadorStore((state) => state.setSlugs);

  const slugs = useMemo(
    () =>
      slugsEscolhidos ??
      dados.ranking.slice(0, SELECAO_INICIAL).map((item) => item.destino.slug),
    [slugsEscolhidos, dados.ranking],
  );

  // Mantém a ordem em que o usuário adicionou os destinos.
  const selecionados = useMemo(
    () =>
      slugs.flatMap((slug) => {
        const item = dados.ranking.find((r) => r.destino.slug === slug);
        return item ? [item] : [];
      }),
    [slugs, dados.ranking],
  );

  const disponiveis = useMemo(
    () => (dados.destinos ?? []).filter((d) => !slugs.includes(d.slug)),
    [dados.destinos, slugs],
  );

  // Ranking sem os destinos já em comparação: alimenta as sugestões do modal.
  const sugestoes = useMemo(
    () => dados.ranking.filter((item) => !slugs.includes(item.destino.slug)),
    [dados.ranking, slugs],
  );

  return {
    session: dados.session,
    isPending: dados.isPending,
    isError: dados.isError,
    selecionados,
    disponiveis,
    sugestoes,
    cheio: slugs.length >= MAX_COMPARADOR,
    adicionar: (slug: string) => {
      if (slugs.length < MAX_COMPARADOR && !slugs.includes(slug)) {
        setSlugs([...slugs, slug]);
      }
    },
    remover: (slug: string) => setSlugs(slugs.filter((item) => item !== slug)),
  };
}
