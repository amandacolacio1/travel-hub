import { X } from "lucide-react";
import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  icon?: ReactNode;
  /** Para chips de filtro (alternam entre ativo e inativo). */
  selected?: boolean;
  onClick?: () => void;
  /** Quando definido, o chip vira uma "tag" escura removível. */
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
};

const BASE =
  "inline-flex items-center gap-inline rounded-full border px-3.5 py-2 font-sans text-sm transition-colors";

export function Chip({
  children,
  icon,
  selected = false,
  onClick,
  onRemove,
  removeLabel = "Remover",
  className = "",
}: ChipProps) {
  if (onRemove) {
    return (
      <span
        className={`${BASE} border-brand-500 bg-brand-500 text-paper ${className}`}
      >
        {icon}
        {children}
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-1 cursor-pointer rounded-full p-0.5 text-paper/70 transition-colors hover:text-paper"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${BASE} cursor-pointer ${
        selected
          ? "border-brand-500 bg-brand-500 text-paper"
          : "border-surface-600 bg-paper text-ink hover:border-brand-300"
      } ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
