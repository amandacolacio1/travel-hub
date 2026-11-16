"use client";

import { useQuery } from "@tanstack/react-query";
import { UnauthorizedError } from "@/shared/session";
import type { LiveConditions } from "../types/live-conditions";

const TRINTA_MINUTOS = 30 * 60 * 1000;

async function fetchLiveConditions(slug: string): Promise<LiveConditions> {
  const resposta = await fetch(`/api/destinos/${encodeURIComponent(slug)}/condicoes`, {
    credentials: "same-origin",
  });
  if (resposta.status === 401) throw new UnauthorizedError();
  if (!resposta.ok) throw new Error("Não foi possível carregar clima e câmbio");
  return resposta.json();
}

/**
 * Clima e câmbio ao vivo de um destino do catálogo. É um complemento: a tela
 * renderiza com os valores de referência enquanto isto carrega ou se falhar,
 * então não há estado de loading/erro para tratar em quem usa.
 */
export function useLiveConditions(slug: string) {
  return useQuery({
    queryKey: ["destinos", slug, "condicoes"],
    queryFn: () => fetchLiveConditions(slug),
    // Mesmo ritmo do cache do servidor: a previsão muda a cada ~30 min.
    staleTime: TRINTA_MINUTOS,
  });
}
