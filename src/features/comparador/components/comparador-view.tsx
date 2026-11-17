"use client";

import { useState } from "react";
import { Page, PageHeader, StateMessage } from "@/shared/components/ui";
import { AdicionarDestinoModal } from "@/features/destinos/components/adicionar-destino-modal";
import { MAX_COMPARADOR, useComparador } from "../hooks/use-comparador";
import { montarResumo } from "../utils/resumo";
import { AdicionarDestino } from "./adicionar-destino";
import { ResumoComparacaoCard } from "./resumo-comparacao";
import { TabelaComparativa } from "./tabela-comparativa";

export function ComparadorView() {
  const comparador = useComparador();
  const [modalAberto, setModalAberto] = useState(false);
  const { selecionados, session } = comparador;

  if (comparador.isPending) {
    return <StateMessage variant="loading" title="Preparando o comparador…" />;
  }

  if (comparador.isError || !session) {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar o comparador"
        description="Tente recarregar a página em instantes."
      />
    );
  }

  const resumo = montarResumo(selecionados, session);

  return (
    <Page>
      <PageHeader
        title="Comparador de destinos"
        description="Analise as métricas que mais importam para a sua jornada e veja, lado a lado, qual destino combina mais com você."
      />

      <AdicionarDestino
        selecionados={selecionados.map((item) => item.destino)}
        disponiveis={comparador.disponiveis}
        cheio={comparador.cheio}
        onAdicionar={comparador.adicionar}
        onRemover={comparador.remover}
      />

      {comparador.preparando ? (
        <p role="status" className="font-sans text-xs text-text-muted-400">
          Preparando {comparador.preparando.cidade} para a comparação…
        </p>
      ) : null}

      {comparador.erro ? (
        <p
          role="alert"
          className="rounded-lg bg-error-50 px-3.5 py-2.5 font-sans text-xs text-error-500"
        >
          {comparador.erro}
        </p>
      ) : null}

      {selecionados.length === 0 ? (
        <StateMessage
          variant="empty"
          title="Escolha destinos para comparar"
          description="Adicione de dois a quatro destinos no campo acima."
        />
      ) : (
        <TabelaComparativa
          itens={selecionados}
          onAdicionar={() => setModalAberto(true)}
        />
      )}

      {resumo ? <ResumoComparacaoCard resumo={resumo} /> : null}

      <AdicionarDestinoModal
        open={modalAberto && !comparador.cheio}
        onOpenChange={setModalAberto}
        sugestoes={comparador.sugestoes}
        perfilViagem={session.perfilViagem}
        limite={{
          vagas: MAX_COMPARADOR - selecionados.length,
          max: MAX_COMPARADOR,
        }}
        onAdicionar={comparador.adicionarCidade}
      />
    </Page>
  );
}
