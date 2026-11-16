import type { PerfilViagem } from "@/features/auth/types/auth";
import type { Session } from "@/shared/session";
import type { Destino, DestinoComScore, InteresseId } from "../types/destino";

/** Duração usada para estimar o custo total da viagem. */
export const DIAS_DE_VIAGEM = 7;

/** Qual interesse pesa mais para cada perfil de viagem. */
export const PERFIL_AFINIDADE: Record<PerfilViagem, InteresseId> = {
  sozinho: "economia",
  casal: "romance",
  familia: "familia",
};

const PESOS = { interesses: 0.45, perfil: 0.3, orcamento: 0.25 } as const;

export function custoEstimado(destino: Destino): number {
  return destino.custoDiarioBRL * DIAS_DE_VIAGEM;
}

function media(valores: number[]): number {
  return valores.reduce((soma, valor) => soma + valor, 0) / valores.length;
}

function notaInteresses(destino: Destino, interesses: string[]): number {
  const afinidades = interesses
    .filter((id): id is InteresseId => id in destino.afinidade)
    .map((id) => destino.afinidade[id]);

  // Sem interesses reconhecidos, o destino é avaliado pela média geral.
  return media(
    afinidades.length > 0 ? afinidades : Object.values(destino.afinidade),
  );
}

/** 10 se cabe no orçamento; perde 1 ponto para cada 10% acima do limite. */
function notaOrcamento(destino: Destino, orcamentoFinal: number): number {
  if (orcamentoFinal <= 0) return 5;

  const razao = custoEstimado(destino) / orcamentoFinal;
  return razao <= 1 ? 10 : Math.max(0, 10 - (razao - 1) * 10);
}

/** Compatibilidade do destino com as preferências do usuário, de 0 a 100. */
export function calcularScore(destino: Destino, session: Session): number {
  const { preferencias, perfilViagem } = session;

  const nota =
    PESOS.interesses * notaInteresses(destino, preferencias.interesses) +
    PESOS.perfil * destino.afinidade[PERFIL_AFINIDADE[perfilViagem]] +
    PESOS.orcamento * notaOrcamento(destino, preferencias.orcamentoFinal);

  return Math.round(nota * 10);
}

/** Destinos ordenados do melhor para o pior; empata pela nota editorial. */
export function rankearDestinos(
  destinos: Destino[],
  session: Session,
): DestinoComScore[] {
  return destinos
    .map((destino) => ({ destino, score: calcularScore(destino, session) }))
    .sort(
      (a, b) => b.score - a.score || b.destino.nota - a.destino.nota,
    );
}
