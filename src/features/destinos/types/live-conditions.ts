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
 * Dados ao vivo de um destino (`GET /api/destinos/[slug]/condicoes`). Cada
 * parte é `null` quando a API externa não respondeu ou não cobre o destino —
 * a tela então fica com os valores de referência do catálogo.
 */
export type LiveConditions = {
  clima: {
    atual: { temperaturaC: number; tipo: ClimaTipo; descricao: string };
    /** Próximos 16 dias, a partir de hoje. */
    dias: ClimaDoDia[];
  } | null;
  cambio: {
    de: string;
    para: string;
    /** Quantidade de `de` a que `valor` se refere (ex.: 100 JPY). */
    base: number;
    /** Quanto `base` unidades de `de` valem em `para`. */
    valor: number;
    /** Dia da cotação (`yyyy-mm-dd`). */
    data: string;
  } | null;
};
