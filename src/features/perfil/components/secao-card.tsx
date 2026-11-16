import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui";

type SecaoCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
};

/** Moldura das seções da tela de perfil: ícone + título serifado + conteúdo. */
export function SecaoCard({
  icon: Icone,
  title,
  description,
  children,
}: SecaoCardProps) {
  return (
    <Card padding="lg" className="flex flex-col gap-block">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-inline font-serif text-lg text-ink">
          <Icone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          {title}
        </h2>
        {description ? (
          <p className="font-sans text-sm text-text-muted-400">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
