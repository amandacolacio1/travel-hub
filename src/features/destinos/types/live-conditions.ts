import type { ClimaTipo } from "./destino";

export type ClimaDoDia = {
  /** `yyyy-mm-dd`, no fuso do destino. */
  data: string;
  minC: number;
  maxC: number;
  tipo: ClimaTipo;
  descricao: string;
  /** Probabilidade máxima de chuva no dia (0–100). */
  chuvaPct: number;
};

/**
 * Clima ao vivo de um destino (`GET /api/destinos/[slug]/condicoes`). É `null`
 * quando a Open-Meteo não respondeu ou não achou a cidade — a tela então fica
 * com a média histórica do catálogo.
 */
export type LiveConditions = {
  clima: {
    atual: { temperaturaC: number; tipo: ClimaTipo; descricao: string };
    /** Próximos 16 dias, a partir de hoje. */
    dias: ClimaDoDia[];
  } | null;
};
