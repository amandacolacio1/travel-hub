import { Compass, Loader2, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type StateMessageProps = {
  variant: "loading" | "error" | "empty";
  title: string;
  description?: string;
  action?: ReactNode;
};

const ICONS = {
  loading: Loader2,
  error: TriangleAlert,
  empty: Compass,
} as const;

/** Carregando, erro ou lista vazia: mesma moldura em todas as telas. */
export function StateMessage({
  variant,
  title,
  description,
  action,
}: StateMessageProps) {
  const Icon = ICONS[variant];

  return (
    <section
      role={variant === "error" ? "alert" : "status"}
      className="flex min-h-[40dvh] flex-col items-center justify-center gap-stack text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt-500 text-brand-alt-400">
        <Icon
          className={`h-5 w-5 ${variant === "loading" ? "animate-spin" : ""}`}
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        {description ? (
          <p className="max-w-sm font-sans text-sm text-text-muted-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </section>
  );
}
