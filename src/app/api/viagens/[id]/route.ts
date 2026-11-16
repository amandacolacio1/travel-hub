import { NextResponse } from "next/server";
import { z } from "zod";
import { updateTripSchema } from "@/features/destinos/schemas/trip.schema";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { NO_STORE, errorResponse, jsonError } from "@/server/http/http-error";
import { deleteTrip, updateTrip } from "@/server/trips/trip-service";

type Contexto = { params: Promise<{ id: string }> };

const idSchema = z.uuid();

/**
 * Sessão + id válidos, ou a resposta de erro pronta. Um id malformado vira
 * 404 (e não 500): para quem chama, "não existe" é o que importa.
 */
async function autorizar(contexto: Contexto) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return { erro: jsonError("Sessão não encontrada", 401) };

  const { id } = await contexto.params;
  if (!idSchema.safeParse(id).success) {
    return { erro: jsonError("Viagem não encontrada", 404) };
  }

  return { usuarioId, id };
}

/** `PATCH /api/viagens/[id]` — muda `status` e/ou `dataPrevista`. */
export async function PATCH(request: Request, contexto: Contexto) {
  const acesso = await autorizar(contexto);
  if ("erro" in acesso) return acesso.erro;

  const corpo = await request.json().catch(() => null);
  const validacao = updateTripSchema.safeParse(corpo);
  if (!validacao.success) {
    return jsonError(validacao.error.issues[0]?.message ?? "Dados inválidos", 400);
  }

  try {
    const viagem = await updateTrip(acesso.usuarioId, acesso.id, validacao.data);
    return NextResponse.json(viagem, { headers: NO_STORE });
  } catch (falha) {
    return errorResponse(falha, "Conflito ao atualizar a viagem");
  }
}

/** `DELETE /api/viagens/[id]` — tira o destino da lista. */
export async function DELETE(_request: Request, contexto: Contexto) {
  const acesso = await autorizar(contexto);
  if ("erro" in acesso) return acesso.erro;

  try {
    await deleteTrip(acesso.usuarioId, acesso.id);
    return new NextResponse(null, { status: 204, headers: NO_STORE });
  } catch (falha) {
    return errorResponse(falha, "Conflito ao remover a viagem");
  }
}
