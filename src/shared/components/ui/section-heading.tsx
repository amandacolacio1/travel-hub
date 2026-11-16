import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  /** Link ou botão alinhado à direita (ex.: "Ver todos"). */
  action?: ReactNode;
  /** Linha fina entre o título e a ação, como no bloco de prioridades do design. */
  withRule?: boolean;
};

/** Título de seção dentro de uma página. */
export function SectionHeading({
  title,
  description,
  action,
  withRule = false,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-stack">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="font-serif text-lg text-ink">{title}</h2>
        {description ? (
          <p className="font-sans text-sm text-text-muted-400">{description}</p>
        ) : null}
      </div>

      {withRule ? (
        <span aria-hidden className="h-px flex-1 bg-surface-600" />
      ) : (
        <span aria-hidden className="flex-1" />
      )}

      {action}
    </div>
  );
}
