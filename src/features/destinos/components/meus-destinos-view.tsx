"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Page,
  PageHeader,
  StateMessage,
} from "@/shared/components/ui";
import { MAX_DESTINOS_SALVOS, useMeusDestinos } from "../hooks/use-meus-destinos";
import { AdicionarDestinoModal } from "./adicionar-destino-modal";
import { BannerDescoberta } from "./banner-descoberta";
import { DestinoSalvoCard } from "./destino-salvo-card";
import { NovoDestinoCard } from "./novo-destino-card";
import { SugestaoCard } from "./sugestao-card";

export function MeusDestinosView() {
  const meus = useMeusDestinos();
  const [modalAberto, setModalAberto] = useState(false);

  if (meus.isPending) {
    return <StateMessage variant="loading" title="Carregando seus destinos…" />;
  }

  if (meus.isError) {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar seus destinos"
        description="Tente recarregar a página em instantes."
      />
    );
  }

  const [sugestao] = meus.sugestoes;

  return (
    <Page>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/dashboard" }, { label: "Meus destinos" }]}
        title="Meus destinos"
        description="Gerencie sua lista de desejos e aventuras planejadas."
        actions={
          <Button
            fullWidth={false}
            disabled={meus.cheio}
            onClick={() => setModalAberto(true)}
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Adicionar novo destino
          </Button>
        }
      />

      <ul className="grid gap-block sm:grid-cols-2 xl:grid-cols-3">
        {meus.itens.map(({ desejado, destino }) => (
          <li key={`${desejado.pais}-${desejado.cidade}`} className="flex">
            <DestinoSalvoCard
              desejado={desejado}
              destino={destino}
              onRemover={() => meus.remover(desejado)}
            />
          </li>
        ))}

        {sugestao && !meus.cheio ? (
          <li className="flex">
            <SugestaoCard item={sugestao} />
          </li>
        ) : null}

        <li className="flex">
          <NovoDestinoCard
            onClick={() => setModalAberto(true)}
            disabled={meus.cheio}
            limite={MAX_DESTINOS_SALVOS}
          />
        </li>
      </ul>

      <BannerDescoberta />

      <AdicionarDestinoModal
        open={modalAberto}
        onOpenChange={setModalAberto}
        catalogo={meus.catalogo}
        sugestoes={meus.sugestoes}
        perfilViagem={meus.perfilViagem}
        limite={{
          vagas: MAX_DESTINOS_SALVOS - meus.itens.length,
          max: MAX_DESTINOS_SALVOS,
        }}
        onAdicionar={meus.adicionar}
      />
    </Page>
  );
}
