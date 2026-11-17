import type { BrazilCity, BrazilState } from "./types";

async function buscar<T>(url: string, erro: string): Promise<T> {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(erro);
  return resposta.json();
}

export function fetchStates(): Promise<BrazilState[]> {
  return buscar("/api/localidades/estados", "Não foi possível carregar os estados");
}

export function fetchCities(uf: string): Promise<BrazilCity[]> {
  return buscar(
    `/api/localidades/estados/${encodeURIComponent(uf)}/cidades`,
    "Não foi possível carregar as cidades",
  );
}
