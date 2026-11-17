import "server-only";

import type { Destino } from "@/features/destinos/types/destino";
import type { LiveConditions } from "@/features/destinos/types/live-conditions";
import { prisma } from "@/server/db/prisma";
import {
  type Coordenadas,
  fetchForecast,
  geocodeCity,
} from "@/server/external/open-meteo";

/**
 * Coordenadas da cidade. Se o destino já está em `destinos` (alguém salvou),
 * usa as colunas `latitude`/`longitude`; quando estão vazias, geocodifica uma
 * vez e grava — o PDF prevê o clima vindo "da latitude e longitude de
 * destinos".
 */
async function buscarCoordenadas(destino: Destino): Promise<Coordenadas | null> {
  const salvo = await prisma.destino.findUnique({
    where: { slug: destino.slug },
    select: { id: true, latitude: true, longitude: true },
  });

  if (salvo?.latitude != null && salvo.longitude != null) {
    return { latitude: Number(salvo.latitude), longitude: Number(salvo.longitude) };
  }

  const coordenadas = await geocodeCity(destino.cidade, destino.estado);

  if (coordenadas && salvo) {
    // Melhor esforço: se falhar, a próxima visita tenta de novo.
    await prisma.destino
      .update({ where: { id: salvo.id }, data: coordenadas })
      .catch(() => {});
  }

  return coordenadas;
}

/**
 * Clima de agora e dos próximos 16 dias (Open-Meteo). Com a API fora do ar,
 * `clima` vem `null` e a tela usa a média histórica.
 */
export async function getLiveConditions(destino: Destino): Promise<LiveConditions> {
  const coordenadas = await buscarCoordenadas(destino).catch(() => null);
  const clima = coordenadas ? await fetchForecast(coordenadas).catch(() => null) : null;
  return { clima };
}
