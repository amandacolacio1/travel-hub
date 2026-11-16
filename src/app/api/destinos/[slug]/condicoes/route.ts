import { NextResponse } from "next/server";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { getLiveConditions } from "@/server/destinations/live-conditions";
import { listarDestinos } from "@/server/destinos/catalogo";
import { NO_STORE, jsonError } from "@/server/http/http-error";
import { findUserCurrency } from "@/server/users/user-repository";

type Contexto = { params: Promise<{ slug: string }> };

/**
 * `GET /api/destinos/[slug]/condicoes` — clima e câmbio ao vivo. Sempre 200
 * quando o destino existe: partes indisponíveis vêm `null` e a tela usa os
 * valores de referência do catálogo.
 */
export async function GET(_request: Request, contexto: Contexto) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const { slug } = await contexto.params;
  const destino = listarDestinos().find((item) => item.slug === slug);
  if (!destino) return jsonError("Destino não encontrado", 404);

  const moeda = await findUserCurrency(usuarioId);
  const condicoes = await getLiveConditions(destino, moeda);

  return NextResponse.json(condicoes, { headers: NO_STORE });
}
