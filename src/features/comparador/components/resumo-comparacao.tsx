import { Scale, Target, Wallet } from "lucide-react";
import { Badge, Card } from "@/shared/components/ui";
import { formatarBRL } from "@/features/destinos/utils/formatadores";
import type { ResumoComparacao } from "../utils/resumo";

export function ResumoComparacaoCard({ resumo }: { resumo: ResumoComparacao }) {
  return (
    <Card tone="muted" padding="lg" className="flex flex-col gap-stack">
      <div className="flex items-center gap-inline">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-paper">
          <Scale className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </span>
        <h2 className="font-serif text-lg text-ink">Resumo da comparação</h2>
      </div>

      <p className="max-w-2xl font-sans text-sm leading-relaxed text-ink">
        {resumo.texto}
      </p>

      <div className="flex flex-wrap gap-inline">
        <Badge tone="neutral" className="bg-paper py-1.5">
          <Target className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          {resumo.matchPct}% de match com seu perfil
        </Badge>
        {resumo.economiaBRL > 0 ? (
          <Badge tone="neutral" className="bg-paper py-1.5">
            <Wallet className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            {formatarBRL(resumo.economiaBRL)} de economia prevista
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}
