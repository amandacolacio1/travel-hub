import { NextResponse } from "next/server";
import { tourApiIdSchema } from "@/features/explorar/schemas/saved-tour.schema";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { NO_STORE, jsonError } from "@/server/http/http-error";
import { unsaveTour } from "@/server/tours/saved-tour-service";

type Contexto = { params: Promise<{ apiId: string }> };

/** `DELETE /api/passeios-salvos/[apiId]` — tira o ♡. Idempotente: sempre 204. */
export async function DELETE(_request: Request, contexto: Contexto) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const { apiId } = await contexto.params;
  const validacao = tourApiIdSchema.safeParse(apiId);
  if (!validacao.success) return jsonError("Dados inválidos", 400);

  await unsaveTour(usuarioId, validacao.data);
  return new NextResponse(null, { status: 204, headers: NO_STORE });
}
