import type { HTMLAttributes } from "react";

export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "dark"
  | "glass";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-500 text-text-muted-500",
  info: "bg-brand-alt-50 text-brand-alt-500",
  success: "bg-success-200 text-success-900",
  warning: "bg-warning-100 text-warning-800",
  error: "bg-error-100 text-error-700",
  dark: "bg-brand-500 text-paper",
  glass: "border border-paper/30 bg-paper/15 text-paper backdrop-blur-sm",
};

/** Rótulo curto em caixa alta: status, categoria ou nível. */
export function Badge({
  tone = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
