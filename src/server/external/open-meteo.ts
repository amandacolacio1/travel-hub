import "server-only";

import type { ClimaTipo } from "@/features/destinos/types/destino";
import type { LiveConditions } from "@/features/destinos/types/live-conditions";
import { fetchJson } from "./fetch-json";

/** Coordenadas de cidade praticamente não mudam. */
const CACHE_GEOCODING_S = 30 * 24 * 60 * 60;
/** A Open-Meteo atualiza o modelo a cada ~15 min; 30 min é folga suficiente. */
const CACHE_PREVISAO_S = 30 * 60;

export type Coordenadas = { latitude: number; longitude: number };

type RespostaGeocoding = {
  results?: { latitude: number; longitude: number }[];
};

/** Latitude e longitude da cidade (não do país). `null` se não achar. */
export async function geocodeCity(
  cidade: string,
  codigoPais: string,
): Promise<Coordenadas | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({
    name: cidade,
    count: "1",
    language: "pt",
    countryCode: codigoPais,
  }).toString();

  const dados = await fetchJson<RespostaGeocoding>(url.toString(), CACHE_GEOCODING_S);
  const [primeiro] = dados?.results ?? [];
  return primeiro ? { latitude: primeiro.latitude, longitude: primeiro.longitude } : null;
}

/**
 * Código WMO (padrão da Open-Meteo) → tipo do ícone + descrição curta.
 * https://open-meteo.com/en/docs#weathervariables
 */
function descreverCodigo(codigo: number): { tipo: ClimaTipo; descricao: string } {
  if (codigo === 0) return { tipo: "sol", descricao: "Céu limpo" };
  if (codigo <= 2) return { tipo: "parcial", descricao: "Parcialmente nublado" };
  if (codigo === 3) return { tipo: "parcial", descricao: "Nublado" };
  if (codigo <= 48) return { tipo: "parcial", descricao: "Neblina" };
  if (codigo <= 57) return { tipo: "chuva", descricao: "Garoa" };
  if (codigo <= 67) return { tipo: "chuva", descricao: "Chuva" };
  if (codigo <= 77) return { tipo: "frio", descricao: "Neve" };
  if (codigo <= 82) return { tipo: "chuva", descricao: "Pancadas de chuva" };
  if (codigo <= 86) return { tipo: "frio", descricao: "Pancadas de neve" };
  return { tipo: "chuva", descricao: "Tempestade" };
}

type RespostaPrevisao = {
  current: { temperature_2m: number; weather_code: number };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
    precipitation_probability_max: (number | null)[];
  };
};

export type Previsao = NonNullable<LiveConditions["clima"]>;

/** Tempo agora + previsão diária dos próximos 16 dias (o máximo da API). */
export async function fetchForecast({
  latitude,
  longitude,
}: Coordenadas): Promise<Previsao | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code",
    daily:
      "temperature_2m_min,temperature_2m_max,weather_code,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "16",
  }).toString();

  const dados = await fetchJson<RespostaPrevisao>(url.toString(), CACHE_PREVISAO_S);
  if (!dados?.current || !dados.daily) return null;

  const { daily } = dados;
  return {
    atual: {
      temperaturaC: Math.round(dados.current.temperature_2m),
      ...descreverCodigo(dados.current.weather_code),
    },
    dias: daily.time.map((data, i) => ({
      data,
      minC: Math.round(daily.temperature_2m_min[i]),
      maxC: Math.round(daily.temperature_2m_max[i]),
      chuvaPct: daily.precipitation_probability_max[i] ?? 0,
      ...descreverCodigo(daily.weather_code[i]),
    })),
  };
}
