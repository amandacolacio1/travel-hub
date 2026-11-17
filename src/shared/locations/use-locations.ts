"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCities, fetchStates } from "./locations.service";

/** Estados e municípios quase nunca mudam: não há por que buscar de novo na sessão. */
const UM_DIA = 24 * 60 * 60 * 1000;

export function useStates() {
  return useQuery({
    queryKey: ["localidades", "estados"],
    queryFn: fetchStates,
    staleTime: UM_DIA,
    gcTime: UM_DIA,
  });
}

/** Municípios do estado; não busca nada enquanto não houver UF escolhida. */
export function useCities(uf: string) {
  return useQuery({
    queryKey: ["localidades", "estados", uf, "cidades"],
    queryFn: () => fetchCities(uf),
    enabled: Boolean(uf),
    staleTime: UM_DIA,
    gcTime: UM_DIA,
  });
}
