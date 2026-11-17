import "server-only";

import type { Destino } from "@/features/destinos/types/destino";
import { rioDeJaneiro } from "./rio-de-janeiro";

/**
 * Catálogo editorial de destinos (só Brasil). Substitui o banco enquanto ele
 * não existe: quando entrar, só `listarDestinos` muda — o contrato do
 * `GET /api/destinos` continua o mesmo.
 */
const CATALOGO: Destino[] = [rioDeJaneiro];

export function listarDestinos(): Destino[] {
  return CATALOGO;
}
