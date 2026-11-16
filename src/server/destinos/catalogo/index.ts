import "server-only";

import type { Destino } from "@/features/destinos/types/destino";
import { bangkok } from "./bangkok";
import { buenosAires } from "./buenos-aires";
import { cidadeDoMexico } from "./cidade-do-mexico";
import { lisboa } from "./lisboa";
import { rioDeJaneiro } from "./rio-de-janeiro";
import { toquio } from "./toquio";
import { zurique } from "./zurique";

/**
 * Catálogo editorial de destinos. Substitui o banco enquanto ele não existe:
 * quando entrar, só `listarDestinos` muda — o contrato do `GET /api/destinos`
 * continua o mesmo.
 */
const CATALOGO: Destino[] = [
  lisboa,
  toquio,
  zurique,
  rioDeJaneiro,
  buenosAires,
  cidadeDoMexico,
  bangkok,
];

export function listarDestinos(): Destino[] {
  return CATALOGO;
}
