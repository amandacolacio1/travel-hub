import { AuthIcon } from "./auth-icon";
import type { InterestOption } from "../constants/interests";

type InterestCardProps = {
  option: InterestOption;
  selected: boolean;
  onToggle: (id: string) => void;
};

export function InterestCard({ option, selected, onToggle }: InterestCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(option.id)}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
        selected
          ? "border-brand-500 bg-brand-500 text-paper"
          : "border-surface-600 bg-paper text-ink hover:border-brand-300"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
          selected ? "bg-paper/15 text-paper" : "bg-surface-alt-500 text-brand-alt-400"
        }`}
      >
        <AuthIcon name={option.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-sm font-semibold">{option.titulo}</span>
        <span
          className={`mt-0.5 block text-xs leading-snug ${
            selected ? "text-paper/75" : "text-text-muted-400"
          }`}
        >
          {option.descricao}
        </span>
      </span>
    </button>
  );
}
