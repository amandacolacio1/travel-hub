import { Lightbulb } from "lucide-react";
import { ButtonLink, Card } from "@/shared/components/ui";
import type { DestinoComScore } from "../types/destino";

/** Próximo destino do ranking que ainda não está na lista do usuário. */
export function SugestaoCard({ item }: { item: DestinoComScore }) {
  const { destino, score } = item;

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-stack text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-600 text-brand-500">
        <Lightbulb className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg text-ink">Sugestão para você</h3>
        <p className="font-sans text-xs leading-relaxed text-text-muted-400">
          {destino.cidade} combina {score}% com o seu perfil e ainda não está
          na sua lista.
        </p>
      </div>
      <ButtonLink href={`/destinos/${destino.slug}`} variant="soft" size="sm">
        Ver {destino.cidade}
      </ButtonLink>
    </Card>
  );
}
