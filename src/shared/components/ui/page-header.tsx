import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
import { Eyebrow } from "./eyebrow";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumb?: BreadcrumbItem[];
  /** Controles à direita do título (botões, seletores). Quebram para baixo no mobile. */
  actions?: ReactNode;
};

/**
 * Cabeçalho padrão de página. Título → descrição a 8px (`gap-inline`) e
 * conteúdo da página a 32px (`gap-section`, definido por `Page`).
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumb,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-stack sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-inline">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? (
          <Eyebrow tone="accent">{eyebrow}</Eyebrow>
        ) : null}
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {description ? (
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted-400">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-stack">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
