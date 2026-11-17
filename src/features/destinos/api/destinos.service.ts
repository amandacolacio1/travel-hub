import type { DestinoDesejado } from "@/features/auth/types/auth";
import { UnauthorizedError } from "@/shared/session";
import type { Destino } from "../types/destino";

export async function fetchDestinos(): Promise<Destino[]> {
  const resposta = await fetch("/api/destinos");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os destinos.");
  }

  return resposta.json();
}

/**
 * Garante a ficha de uma cidade (`POST /api/destinos`) e devolve o destino
 * pronto. Pode demorar: com uma IA de verdade, a ficha leva alguns segundos.
 */
export async function ensureDestination({ uf, cidade }: DestinoDesejado): Promise<Destino> {
  const resposta = await fetch("/api/destinos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ uf, cidade }),
  });

  if (resposta.status === 401) throw new UnauthorizedError();
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(
      typeof corpo?.message === "string"
        ? corpo.message
        : "Não foi possível preparar este destino.",
    );
  }
  return resposta.json();
}
