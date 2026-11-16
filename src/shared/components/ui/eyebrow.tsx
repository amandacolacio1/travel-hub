import type { HTMLAttributes } from "react";

type EyebrowTone = "default" | "accent" | "onImage";

const TONES: Record<EyebrowTone, string> = {
  default: "text-text-muted-500",
  accent: "text-brand-alt-400",
  onImage: "text-paper/70",
};

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: EyebrowTone;
};

/**
 * Rótulo pequeno em caixa alta acima de títulos, valores e campos. A cor vem
 * sempre de `tone` (não de `className`) para não brigar com a cor padrão.
 */
export function Eyebrow({
  tone = "default",
  className = "",
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={`font-sans text-[11px] font-medium tracking-[0.08em] uppercase ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
