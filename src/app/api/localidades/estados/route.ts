import { NextResponse } from "next/server";
import { jsonError } from "@/server/http/http-error";
import { listStates } from "@/server/external/ibge";

/** Dado público e estável: CDN e navegador podem guardar por um dia. */
const CACHE_PUBLICO = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

/**
 * `GET /api/localidades/estados` — os 27 estados (IBGE). Público: o wizard de
 * cadastro usa antes do login.
 */
export async function GET() {
  const estados = await listStates();
  if (!estados) return jsonError("Não foi possível carregar os estados agora.", 503);

  return NextResponse.json(estados, { headers: CACHE_PUBLICO });
}
