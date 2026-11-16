"use client";

import { ButtonLink, Page, StateMessage } from "@/shared/components/ui";
import { useSession } from "@/shared/session";
import { useDestino } from "../api/use-destinos";
import { useLiveConditions } from "../api/use-live-conditions";
import { DestinoHero } from "./destino-hero";
import { DestinoResumo } from "./destino-resumo";
import { DestinoStats } from "./destino-stats";
import { PontosDeInteresse } from "./pontos-de-interesse";

export function DestinoDetalheView({ slug }: { slug: string }) {
  const { destino, isPending, isError } = useDestino(slug);
  const { session, isPending: carregandoSessao } = useSession();
  // Não bloqueia a tela: os cards começam com o catálogo e se atualizam.
  const { data: condicoes } = useLiveConditions(slug);

  if (isPending || carregandoSessao) {
    return <StateMessage variant="loading" title="Carregando destino…" />;
  }

  if (isError) {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar o destino"
        description="Tente recarregar a página em instantes."
      />
    );
  }

  if (!destino || !session) {
    return (
      <StateMessage
        variant="empty"
        title="Destino não encontrado"
        description="Este destino não existe ou ainda não está no catálogo."
        action={<ButtonLink href="/destinos">Voltar para meus destinos</ButtonLink>}
      />
    );
  }

  return (
    <Page>
      {/* Os cards de estatística sobem sobre a base da foto (sem o gap da página). */}
      <div className="flex flex-col">
        <DestinoHero destino={destino} />
        <div className="relative z-10 -mt-10 px-stack lg:px-block">
          <DestinoStats
            destino={destino}
            dataPrevista={session.preferencias.dataPrevista}
            condicoes={condicoes}
          />
        </div>
      </div>

      <DestinoResumo destino={destino} session={session} />
      <PontosDeInteresse destino={destino} />
    </Page>
  );
}
