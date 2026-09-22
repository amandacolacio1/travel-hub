import { AuthIcon } from "./auth-icon";
import type { ProfileOption } from "../constants/travel-profiles";
import type { PerfilViagem } from "../types/auth";

type ProfileCardProps = {
  option: ProfileOption;
  selected: boolean;
  onSelect: (id: PerfilViagem) => void;
};

export function ProfileCard({ option, selected, onSelect }: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-paper p-4 text-left transition-colors ${
        selected
          ? "border-2 border-brand-500"
          : "border-surface-600 hover:border-brand-300"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-alt-50 text-brand-alt-400">
        <AuthIcon name={option.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-sm font-semibold text-ink">{option.titulo}</span>
        <span className="mt-0.5 block text-xs leading-snug text-text-muted-400">
          {option.descricao}
        </span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-brand-500 bg-brand-500 text-paper"
            : "border-surface-600 bg-paper"
        }`}
        aria-hidden
      >
        {selected ? <AuthIcon name="check" className="h-3 w-3" /> : null}
      </span>
    </button>
  );
}
