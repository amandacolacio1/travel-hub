"use client";

import { Page, PageHeader, StateMessage } from "@/shared/components/ui";
import { useSession } from "@/shared/session";
import { PerfilForm } from "./perfil-form";

export function PerfilView() {
  const { session, isPending } = useSession();

  if (isPending || !session) {
    return <StateMessage variant="loading" title="Carregando seu perfil…" />;
  }

  return (
    <Page width="narrow">
      <PageHeader
        title="Perfil do membro"
        description="Personalize sua experiência. Estas configurações calibram as suas recomendações e a pontuação de cada destino."
      />
      <PerfilForm session={session} />
    </Page>
  );
}
