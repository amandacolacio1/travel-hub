import { NextResponse } from "next/server";
import { createTripSchema } from "@/features/destinos/schemas/trip.schema";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { NO_STORE, errorResponse, jsonError } from "@/server/http/http-error";
import { createTrip, listTrips } from "@/server/trips/trip-service";

const DESTINO_REPETIDO = "Este destino já está na sua lista";

/** `GET /api/viagens` — "Meus destinos" do usuário logado, em ordem de inclusão. */
export async function GET() {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  return NextResponse.json(await listTrips(usuarioId), { headers: NO_STORE });
}

/** `POST /api/viagens` — salva um destino `{ pais, cidade, dataPrevista? }`. */
export async function POST(request: Request) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const corpo = await request.json().catch(() => null);
  const validacao = createTripSchema.safeParse(corpo);
  if (!validacao.success) {
    return jsonError(validacao.error.issues[0]?.message ?? "Dados inválidos", 400);
  }

  try {
    const viagem = await createTrip(usuarioId, validacao.data);
    return NextResponse.json(viagem, { status: 201, headers: NO_STORE });
  } catch (falha) {
    return errorResponse(falha, DESTINO_REPETIDO);
  }
}
