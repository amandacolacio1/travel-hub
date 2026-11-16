import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import type { DestinoComScore } from "@/features/destinos/types/destino";
import { formatarBRL } from "@/features/destinos/utils/formatadores";
import { DIAS_DE_VIAGEM } from "@/features/destinos/utils/score";
import type { Session } from "@/shared/session";

export type ResumoComparacao = {
  texto: string;
  matchPct: number;
  economiaBRL: number;
};

function extremo(
  itens: DestinoComScore[],
  valor: (item: DestinoComScore) => number,
  tipo: "min" | "max",
): DestinoComScore {
  return itens.reduce((atual, item) => {
    const melhor = tipo === "max" ? valor(item) > valor(atual) : valor(item) < valor(atual);
    return melhor ? item : atual;
  });
}

/** Resume o confronto entre os destinos escolhidos; exige ao menos dois. */
export function montarResumo(
  itens: DestinoComScore[],
  session: Session,
): ResumoComparacao | null {
  if (itens.length < 2) return null;

  const vencedor = extremo(itens, (i) => i.score, "max");
  const maisBarato = extremo(itens, (i) => i.destino.custoDiarioBRL, "min");
  const maisCaro = extremo(itens, (i) => i.destino.custoDiarioBRL, "max");
  const economiaBRL =
    (maisCaro.destino.custoDiarioBRL - maisBarato.destino.custoDiarioBRL) *
    DIAS_DE_VIAGEM;
  const perfil =
    TRAVEL_PROFILES.find((p) => p.id === session.perfilViagem)?.titulo ?? "";

  const compatibilidade = `Para o seu perfil "${perfil}" e orçamento de ${formatarBRL(session.preferencias.orcamentoFinal)}, ${vencedor.destino.cidade} é a melhor combinação, com ${vencedor.score}% de compatibilidade. ${vencedor.destino.resumo}`;
  const custo =
    economiaBRL > 0
      ? `${maisBarato.destino.cidade} é a opção mais econômica: ${formatarBRL(economiaBRL)} a menos que ${maisCaro.destino.cidade} em ${DIAS_DE_VIAGEM} dias.`
      : "Os destinos escolhidos têm custo diário equivalente.";

  return {
    texto: `${compatibilidade} ${custo}`,
    matchPct: vencedor.score,
    economiaBRL,
  };
}
