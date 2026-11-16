import "server-only";

import type { Destino } from "@/features/destinos/types/destino";
import type { LiveConditions } from "@/features/destinos/types/live-conditions";
import { prisma } from "@/server/db/prisma";
import { fetchExchangeRate } from "@/server/external/frankfurter";
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
    where: {
      codigoPais_cidade: { codigoPais: destino.codigoPais, cidade: destino.cidade },
    },
    select: { id: true, latitude: true, longitude: true },
  });

  if (salvo?.latitude != null && salvo.longitude != null) {
    return { latitude: Number(salvo.latitude), longitude: Number(salvo.longitude) };
  }

  const coordenadas = await geocodeCity(destino.cidade, destino.codigoPais);

  if (coordenadas && salvo) {
    // Melhor esforço: se falhar, a próxima visita tenta de novo.
    await prisma.destino
      .update({ where: { id: salvo.id }, data: coordenadas })
      .catch(() => {});
  }

  return coordenadas;
}

async function buscarClima(destino: Destino): Promise<LiveConditions["clima"]> {
  const coordenadas = await buscarCoordenadas(destino);
  return coordenadas ? fetchForecast(coordenadas) : null;
}

async function buscarCambio(
  destino: Destino,
  moedaDoUsuario: string,
): Promise<LiveConditions["cambio"]> {
  const { codigo, base } = destino.moeda;
  if (codigo === moedaDoUsuario) return null;

  const cotacao = await fetchExchangeRate(codigo, moedaDoUsuario);
  if (!cotacao) return null;

  return {
    de: codigo,
    para: moedaDoUsuario,
    base,
    valor: cotacao.taxa * base,
    data: cotacao.data,
  };
}

/**
 * Clima (Open-Meteo) e câmbio (Frankfurter, para a moeda do usuário em
 * `preferencias.moeda`) em paralelo. Uma API fora do ar zera só a sua parte.
 */
export async function getLiveConditions(
  destino: Destino,
  moedaDoUsuario: string,
): Promise<LiveConditions> {
  const [clima, cambio] = await Promise.all([
    buscarClima(destino).catch(() => null),
    buscarCambio(destino, moedaDoUsuario).catch(() => null),
  ]);
  return { clima, cambio };
}
