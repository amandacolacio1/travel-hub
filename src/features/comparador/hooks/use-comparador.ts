"use client";

import { useMemo } from "react";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type { DestinoDesejado } from "@/features/auth/types/auth";
import {
  useDestinosRanking,
  useEnsureDestinationMutation,
} from "@/features/destinos/api/use-destinos";
import { useComparadorStore } from "../store/use-comparador-store";

export const MAX_COMPARADOR = MAX_DESTINATIONS;
const SELECAO_INICIAL = 3;

/** Destinos em comparação (com score), mais as ações de adicionar e remover. */
export function useComparador() {
  const dados = useDestinosRanking();
  const slugsEscolhidos = useComparadorStore((state) => state.slugs);
  const setSlugs = useComparadorStore((state) => state.setSlugs);
  const preparar = useEnsureDestinationMutation();

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

  function adicionar(slug: string) {
    // Lê a escolha mais recente: com a ficha sendo preparada, a lista pode ter
    // mudado desde o clique.
    const atuais = useComparadorStore.getState().slugs ?? slugs;
    if (atuais.length < MAX_COMPARADOR && !atuais.includes(slug)) {
      setSlugs([...atuais, slug]);
    }
  }

  return {
    session: dados.session,
    isPending: dados.isPending,
    isError: dados.isError,
    selecionados,
    disponiveis,
    sugestoes,
    cheio: slugs.length >= MAX_COMPARADOR,
    adicionar,
    /**
     * Cidade escolhida no modal (qualquer uma do IBGE): prepara a ficha, se
     * ainda não existir, e só então entra na comparação.
     */
    adicionarCidade: (cidade: DestinoDesejado) =>
      preparar.mutate(cidade, { onSuccess: (destino) => adicionar(destino.slug) }),
    /** Cidade cuja ficha está sendo preparada para entrar na comparação. */
    preparando: preparar.isPending ? preparar.variables : undefined,
    erro: preparar.error?.message,
    remover: (slug: string) => setSlugs(slugs.filter((item) => item !== slug)),
  };
}
