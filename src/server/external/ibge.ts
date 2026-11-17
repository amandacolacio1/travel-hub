import "server-only";

import type { BrazilCity, BrazilState } from "@/shared/locations/types";
import { fetchJson } from "./fetch-json";

/**
 * API de localidades do IBGE: pública, sem chave.
 * https://servicodados.ibge.gov.br/api/docs/localidades
 */
const BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

/** Estados e municípios mudam quase nunca (um município novo por década). */
const CACHE_LOCALIDADES_S = 30 * 24 * 60 * 60;

type RespostaEstado = {
  id: number;
  sigla: string;
  nome: string;
  regiao: { nome: string };
};

type RespostaMunicipio = { id: number; nome: string };

/** Os 27 estados (com o DF), em ordem alfabética. `null` se o IBGE falhar. */
export async function listStates(): Promise<BrazilState[] | null> {
  const dados = await fetchJson<RespostaEstado[]>(
    `${BASE}/estados?orderBy=nome`,
    CACHE_LOCALIDADES_S,
  );

  return (
    dados?.map(({ sigla, nome, regiao }) => ({ uf: sigla, nome, regiao: regiao.nome })) ??
    null
  );
}

/** Municípios do estado, em ordem alfabética. `null` se o IBGE falhar. */
export async function listCities(uf: string): Promise<BrazilCity[] | null> {
  const dados = await fetchJson<RespostaMunicipio[]>(
    `${BASE}/estados/${encodeURIComponent(uf)}/municipios?orderBy=nome`,
    CACHE_LOCALIDADES_S,
  );

  return dados?.map(({ id, nome }) => ({ ibgeId: id, nome })) ?? null;
}
