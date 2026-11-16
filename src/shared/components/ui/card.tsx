import type { HTMLAttributes } from "react";

type CardTone = "default" | "muted" | "dashed" | "dark";
type CardPadding = "none" | "md" | "lg";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  /** `md` é o padrão (p-card); `lg` para cards de destaque; `none` quando o conteúdo vai de borda a borda (imagens). */
  padding?: CardPadding;
};

const TONES: Record<CardTone, string> = {
  default: "border-surface-600 bg-paper shadow-card",
  muted: "border-surface-600 bg-surface-alt-500",
  dashed: "border-dashed border-surface-700 bg-transparent",
  dark: "border-brand-500 bg-brand-500 text-paper shadow-card",
};

const PADDINGS: Record<CardPadding, string> = {
  none: "",
  md: "p-card",
  lg: "p-card-lg",
};

/** Superfície base de qualquer bloco de conteúdo: borda, raio e sombra padronizados. */
export function Card({
  tone = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-card border ${TONES[tone]} ${PADDINGS[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
