import { AuthIcon } from "@/features/auth/components/auth-icon";
import { Card, SectionHeading } from "@/shared/components/ui";
import type { Prioridade } from "@/features/destinos/utils/analise";

/** Interesses e perfil do usuário que pesam no ranking; o primeiro é o mais forte. */
export function PrioridadesSection({
  prioridades,
}: {
  prioridades: Prioridade[];
}) {
  return (
    <section className="flex flex-col gap-stack">
      <SectionHeading title="O que priorizamos para você" withRule />

      <ul className="grid gap-stack sm:grid-cols-2 xl:grid-cols-4">
        {prioridades.map(({ id, titulo, descricao }, indice) => {
          const destaque = indice === 0;

          return (
            <li key={id} className="flex">
              <Card
                tone={destaque ? "dark" : "default"}
                className="flex w-full flex-col items-center gap-stack text-center"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    destaque ? "bg-paper/10 text-paper" : "bg-brand-500 text-paper"
                  }`}
                >
                  <AuthIcon name={id} className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-base">{titulo}</h3>
                  <p
                    className={`font-sans text-xs leading-relaxed ${
                      destaque ? "text-paper/70" : "text-text-muted-400"
                    }`}
                  >
                    {descricao}
                  </p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
