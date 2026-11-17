import type { Destino, NivelCusto } from "../types/destino";

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const MS_POR_DIA = 86_400_000;

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatarBRL(valor: number): string {
  return brl.format(valor);
}

/** Nota editorial com uma casa decimal (ex.: 9,4). */
export function formatarNota(nota: number): string {
  return nota.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** `"2026-11-16"` → `"16/11"`. */
export function formatarDiaMes(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/** Ex.: [3, 4, 5] → "Mar – Mai". */
export function periodoDosMeses(meses: number[]): string {
  const primeiro = MESES[meses[0] - 1];
  const ultimo = MESES[meses[meses.length - 1] - 1];
  return meses.length === 1 ? primeiro : `${primeiro} – ${ultimo}`;
}

export function faixaDeClima({ minC, maxC }: { minC: number; maxC: number }): string {
  return `${minC}–${maxC}°C`;
}

export function temperaturaMedia({ minC, maxC }: Destino["clima"]): number {
  return Math.round((minC + maxC) / 2);
}

export function nivelDeCusto(custoDiarioBRL: number): NivelCusto {
  if (custoDiarioBRL < 300) return "economico";
  if (custoDiarioBRL < 500) return "moderado";
  if (custoDiarioBRL < 900) return "alto";
  return "muito-alto";
}

/** Mês da data (`yyyy-mm-dd`) por extenso, ex.: "outubro"; `null` se inválida. */
export function mesPorExtenso(iso: string): string | null {
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (!ano || !mes || !dia) return null;

  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    month: "long",
  });
}

/** Dias entre hoje e a data (`yyyy-mm-dd`); `null` se vazia ou inválida. */
export function diasAte(iso: string): number | null {
  if (!iso) return null;

  // Horário local: `new Date("yyyy-mm-dd")` seria UTC e erraria um dia.
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (!ano || !mes || !dia) return null;

  const hoje = new Date();
  const inicioDeHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  );
  const alvo = new Date(ano, mes - 1, dia);

  return Math.max(0, Math.round((alvo.getTime() - inicioDeHoje.getTime()) / MS_POR_DIA));
}
