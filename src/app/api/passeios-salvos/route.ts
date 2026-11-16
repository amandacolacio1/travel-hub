import { NextResponse } from "next/server";
import { saveTourSchema } from "@/features/explorar/schemas/saved-tour.schema";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { NO_STORE, errorResponse, jsonError } from "@/server/http/http-error";
import { listSavedTours, saveTour } from "@/server/tours/saved-tour-service";

/** `GET /api/passeios-salvos` — passeios com ♡ do usuário, mais recentes primeiro. */
export async function GET() {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  return NextResponse.json(await listSavedTours(usuarioId), { headers: NO_STORE });
}

/** `POST /api/passeios-salvos` — `{ apiId }`. Salvar de novo não é erro. */
export async function POST(request: Request) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const corpo = await request.json().catch(() => null);
  const validacao = saveTourSchema.safeParse(corpo);
  if (!validacao.success) return jsonError("Dados inválidos", 400);

  try {
    const salvo = await saveTour(usuarioId, validacao.data.apiId);
    return NextResponse.json(salvo, { status: 201, headers: NO_STORE });
  } catch (falha) {
    // P2002 só acontece se duas pessoas criarem a mesma cópia no mesmo instante.
    return errorResponse(falha, "Não foi possível salvar agora. Tente novamente.");
  }
}
