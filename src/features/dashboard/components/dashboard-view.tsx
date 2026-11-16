"use client";

import { Page, StateMessage } from "@/shared/components/ui";
import { useDestinosRanking } from "@/features/destinos/api/use-destinos";
import {
  motivosDeCompatibilidade,
  prioridadesDoUsuario,
} from "@/features/destinos/utils/analise";
import { DestaqueHero } from "./destaque-hero";
import { MotivosSection } from "./motivos-section";
import { PrioridadesSection } from "./prioridades-section";
import { RankingCard } from "./ranking-card";

export function DashboardView() {
  const { ranking, session, isPending, isError } = useDestinosRanking();

  if (isPending) {
    return <StateMessage variant="loading" title="Montando seu ranking…" />;
  }

  if (isError || !session || ranking.length === 0) {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar o ranking"
        description="Tente recarregar a página em instantes."
      />
    );
  }

  const [lider] = ranking;

  return (
    <Page>
      <DestaqueHero item={lider} />

      <div className="grid gap-section lg:grid-cols-3">
        <RankingCard ranking={ranking} />

        <div className="flex flex-col gap-section lg:col-span-2">
          <MotivosSection motivos={motivosDeCompatibilidade(lider.destino, session)} />
          <PrioridadesSection prioridades={prioridadesDoUsuario(session)} />
        </div>
      </div>
    </Page>
  );
}
