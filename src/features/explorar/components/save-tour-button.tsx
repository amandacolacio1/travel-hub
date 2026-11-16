import { Heart } from "lucide-react";

type SaveTourButtonProps = {
  salvo: boolean;
  /** Nome do passeio, para o leitor de tela saber o que está sendo salvo. */
  titulo: string;
  onClick: () => void;
  className?: string;
};

/** ♡ redondo sobre a foto do card. `aria-pressed` anuncia o estado ligado/desligado. */
export function SaveTourButton({
  salvo,
  titulo,
  onClick,
  className = "",
}: SaveTourButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={salvo}
      aria-label={salvo ? `Remover ${titulo} dos salvos` : `Salvar ${titulo}`}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink shadow-card transition-colors hover:bg-paper ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${salvo ? "fill-current text-brand-500" : ""}`}
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}
