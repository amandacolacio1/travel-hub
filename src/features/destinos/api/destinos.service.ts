import type { Destino } from "../types/destino";

export async function fetchDestinos(): Promise<Destino[]> {
  const resposta = await fetch("/api/destinos");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os destinos.");
  }

  return resposta.json();
}
