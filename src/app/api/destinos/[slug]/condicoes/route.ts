import { NextResponse } from "next/server";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { findCatalogDestination } from "@/server/destinations/destination-catalog";
import { getLiveConditions } from "@/server/destinations/live-conditions";
import { NO_STORE, jsonError } from "@/server/http/http-error";

type Contexto = { params: Promise<{ slug: string }> };

/**
 * `GET /api/destinos/[slug]/condicoes` — clima ao vivo. Sempre 200 quando o
 * destino existe: sem resposta da Open-Meteo, `clima` vem `null` e a tela usa
 * a média histórica do catálogo.
 */
export async function GET(_request: Request, contexto: Contexto) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const { slug } = await contexto.params;
  const destino = await findCatalogDestination(slug);
  if (!destino) return jsonError("Destino não encontrado", 404);

  const condicoes = await getLiveConditions(destino);

  return NextResponse.json(condicoes, { headers: NO_STORE });
}
