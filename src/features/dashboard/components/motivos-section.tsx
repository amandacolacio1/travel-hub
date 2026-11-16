import { Sun, Users, Wallet, type LucideIcon } from "lucide-react";
import { Card, SectionHeading } from "@/shared/components/ui";
import type { Motivo } from "@/features/destinos/utils/analise";

const ICONES: Record<Motivo["id"], LucideIcon> = {
  orcamento: Wallet,
  clima: Sun,
  perfil: Users,
};

/** Os três critérios que explicam por que o destino líder combina com o usuário. */
export function MotivosSection({ motivos }: { motivos: Motivo[] }) {
  return (
    <section className="flex flex-col gap-stack">
      <SectionHeading title="Por que combina com você" />

      <ul className="grid gap-stack sm:grid-cols-3">
        {motivos.map(({ id, titulo, descricao }) => {
          const Icone = ICONES[id];

          return (
            <li key={id} className="flex">
              <Card className="flex w-full flex-col gap-stack">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-paper">
                  <Icone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-base text-ink">{titulo}</h3>
                  <p className="font-sans text-xs leading-relaxed text-text-muted-400">
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
