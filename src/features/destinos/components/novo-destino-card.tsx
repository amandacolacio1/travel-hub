import { Plus } from "lucide-react";
import { Card } from "@/shared/components/ui";

type NovoDestinoCardProps = {
  onClick: () => void;
  disabled: boolean;
  limite: number;
};

export function NovoDestinoCard({
  onClick,
  disabled,
  limite,
}: NovoDestinoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full cursor-pointer rounded-card text-left disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Card
        tone="dashed"
        className="flex min-h-48 w-full flex-col items-center justify-center gap-stack text-center transition-colors hover:border-brand-300"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-500 text-ink">
          <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="font-sans text-sm font-medium text-ink">
          {disabled ? `Limite de ${limite} destinos` : "Novo destino"}
        </span>
      </Card>
    </button>
  );
}
