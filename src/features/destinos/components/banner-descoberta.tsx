import { Compass } from "lucide-react";
import { ButtonLink, Card } from "@/shared/components/ui";

/** Chamada final da tela: leva quem está indeciso para Explorar ou Comparador. */
export function BannerDescoberta() {
  return (
    <Card tone="muted" padding="lg" className="flex flex-col gap-stack lg:p-8">
      <div className="flex items-center gap-inline">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-paper">
          <Compass className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </span>
        <h2 className="font-serif text-xl text-ink">
          Não sabe para onde ir em seguida?
        </h2>
      </div>

      <p className="max-w-xl font-sans text-sm leading-relaxed text-text-muted-500">
        Veja experiências selecionadas para o seu perfil ou compare destinos
        lado a lado por custo, clima e temporada.
      </p>

      <div className="flex flex-wrap gap-inline">
        <ButtonLink href="/explorar">Explorar experiências</ButtonLink>
        <ButtonLink href="/comparador" variant="secondary" className="border border-surface-600">
          Comparar destinos
        </ButtonLink>
      </div>
    </Card>
  );
}
