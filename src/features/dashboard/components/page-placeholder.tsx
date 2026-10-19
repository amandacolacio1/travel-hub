import type { LucideIcon } from "lucide-react";

type PagePlaceholderProps = {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
};

/** Tela de rota ainda não construída — mantém a navegação inteira funcional. */
export function PagePlaceholder({
  titulo,
  descricao,
  icon: Icon,
}: PagePlaceholderProps) {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt-500 text-brand-alt-400">
        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <h1 className="font-serif text-xl text-ink">{titulo}</h1>
      <p className="max-w-sm font-sans text-sm text-text-muted-400">
        {descricao}
      </p>
    </section>
  );
}
