import "server-only";

import { fetchJson } from "./fetch-json";

/** O Banco Central Europeu publica uma cotação por dia útil; 1 h basta. */
const CACHE_COTACAO_S = 60 * 60;

type RespostaCotacao = {
  date: string;
  rates: Record<string, number>;
};

export type Cotacao = {
  /** Quanto 1 unidade de `de` vale em `para`. */
  taxa: number;
  /** Dia da cotação (`yyyy-mm-dd`). */
  data: string;
};

/**
 * Cotação do dia pela Frankfurter (dados do BCE, sem chave). Só cobre ~30
 * moedas — o peso argentino (ARS), por exemplo, não está lá; nesses casos
 * devolve `null` e a tela usa a cotação de referência do catálogo.
 */
export async function fetchExchangeRate(
  de: string,
  para: string,
): Promise<Cotacao | null> {
  const url = `https://api.frankfurter.dev/v1/latest?base=${de}&symbols=${para}`;
  const dados = await fetchJson<RespostaCotacao>(url, CACHE_COTACAO_S);

  const taxa = dados?.rates[para];
  return dados && taxa ? { taxa, data: dados.date } : null;
}
