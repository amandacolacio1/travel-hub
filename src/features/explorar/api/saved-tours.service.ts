import { UnauthorizedError } from "@/shared/session";
import type { SavedTour } from "../types/saved-tour";

const BASE = "/api/passeios-salvos";

async function verificar(resposta: Response, padrao: string) {
  if (resposta.status === 401) throw new UnauthorizedError();
  if (resposta.ok) return;

  const corpo = await resposta.json().catch(() => null);
  throw new Error(typeof corpo?.message === "string" ? corpo.message : padrao);
}

export async function fetchSavedTours(): Promise<SavedTour[]> {
  const resposta = await fetch(BASE, { credentials: "same-origin", cache: "no-store" });
  await verificar(resposta, "Não foi possível carregar os passeios salvos");
  return resposta.json();
}

export async function saveTour(apiId: string): Promise<void> {
  const resposta = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ apiId }),
  });
  await verificar(resposta, "Não foi possível salvar o passeio");
}

export async function unsaveTour(apiId: string): Promise<void> {
  const resposta = await fetch(`${BASE}/${encodeURIComponent(apiId)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  await verificar(resposta, "Não foi possível remover o passeio");
}
