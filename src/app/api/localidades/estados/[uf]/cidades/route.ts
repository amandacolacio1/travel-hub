import { NextResponse } from "next/server";
import { ufSchema } from "@/features/destinos/schemas/trip.schema";
import { jsonError } from "@/server/http/http-error";
import { listCities } from "@/server/external/ibge";

type Contexto = { params: Promise<{ uf: string }> };

const CACHE_PUBLICO = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

/**
 * `GET /api/localidades/estados/[uf]/cidades` — municípios do estado (IBGE).
 * Público, como a lista de estados.
 */
export async function GET(_request: Request, contexto: Contexto) {
  const resultado = ufSchema.safeParse((await contexto.params).uf);
  if (!resultado.success) return jsonError("Estado inválido", 400);

  const cidades = await listCities(resultado.data);
  if (!cidades) return jsonError("Não foi possível carregar as cidades agora.", 503);
  // UF com formato válido mas inexistente ("XX"): o IBGE devolve lista vazia.
  if (cidades.length === 0) return jsonError("Estado não encontrado", 404);

  return NextResponse.json(cidades, { headers: CACHE_PUBLICO });
}
