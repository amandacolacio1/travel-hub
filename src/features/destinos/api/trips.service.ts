import { UnauthorizedError } from "@/shared/session";
import type {
  CreateTripPayload,
  UpdateTripPayload,
} from "../schemas/trip.schema";
import type { Trip } from "../types/trip";

const BASE = "/api/viagens";

/** Lança com a mensagem do servidor ("Você pode planejar até 4…"). */
async function verificar(resposta: Response, padrao: string) {
  if (resposta.status === 401) throw new UnauthorizedError();
  if (resposta.ok) return;

  const corpo = await resposta.json().catch(() => null);
  throw new Error(typeof corpo?.message === "string" ? corpo.message : padrao);
}

function enviarJson(metodo: "POST" | "PATCH", url: string, corpo: unknown) {
  return fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(corpo),
  });
}

export async function fetchTrips(): Promise<Trip[]> {
  const resposta = await fetch(BASE, { credentials: "same-origin", cache: "no-store" });
  await verificar(resposta, "Não foi possível carregar seus destinos");
  return resposta.json();
}

export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const resposta = await enviarJson("POST", BASE, payload);
  await verificar(resposta, "Não foi possível salvar o destino");
  return resposta.json();
}

export async function updateTrip(
  id: string,
  patch: UpdateTripPayload,
): Promise<Trip> {
  const resposta = await enviarJson("PATCH", `${BASE}/${id}`, patch);
  await verificar(resposta, "Não foi possível atualizar o destino");
  return resposta.json();
}

export async function deleteTrip(id: string): Promise<void> {
  const resposta = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  await verificar(resposta, "Não foi possível remover o destino");
}
