import { NextResponse } from "next/server";
import { createTripSchema } from "@/features/destinos/schemas/trip.schema";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { prisma } from "@/server/db/prisma";
import {
  ensureProfileAndWait,
  listCatalog,
} from "@/server/destinations/destination-catalog";
import { resolveDestinationOrThrow } from "@/server/destinations/resolve-destination";
import { upsertDestination } from "@/server/destinations/upsert-destination";
import { NO_STORE, errorResponse, jsonError } from "@/server/http/http-error";

/** Gerar uma ficha pode levar dezenas de segundos com uma IA de verdade. */
export const maxDuration = 60;

/** `GET /api/destinos` — catálogo (destinos com ficha pronta); o ranking é calculado por quem consome. */
export async function GET() {
  return NextResponse.json(await listCatalog(), { headers: NO_STORE });
}

/** Mesmo `{ uf, cidade }` de `POST /api/viagens`, sem a data. */
const garantirFichaSchema = createTripSchema.pick({ uf: true, cidade: true });

/**
 * `POST /api/destinos` — garante a ficha de uma cidade `{ uf, cidade }` e
 * devolve o destino do catálogo. Usado pelo comparador e pelo "Tentar de
 * novo" quando a geração falhou. 502 se a ficha não pôde ser gerada.
 */
export async function POST(request: Request) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return jsonError("Sessão não encontrada", 401);

  const validacao = garantirFichaSchema.safeParse(await request.json().catch(() => null));
  if (!validacao.success) {
    return jsonError(validacao.error.issues[0]?.message ?? "Dados inválidos", 400);
  }

  try {
    const { uf, cidade } = validacao.data;
    const resolvido = await resolveDestinationOrThrow(uf, cidade);
    await upsertDestination(prisma, resolvido);

    const destino = await ensureProfileAndWait(resolvido.slug);
    if (!destino) {
      return jsonError("Não foi possível preparar este destino agora. Tente de novo.", 502);
    }
    return NextResponse.json(destino, { headers: NO_STORE });
  } catch (falha) {
    return errorResponse(falha, "Conflito ao salvar o destino");
  }
}
