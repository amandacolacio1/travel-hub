import { Thermometer, Wallet } from "lucide-react";
import Link from "next/link";
import { Card, ScoreBar, SectionHeading } from "@/shared/components/ui";
import { NIVEL_CUSTO } from "@/features/destinos/constants/rotulos";
import type { DestinoComScore } from "@/features/destinos/types/destino";
import {
  nivelDeCusto,
  temperaturaMedia,
} from "@/features/destinos/utils/formatadores";

const MAX_ITENS = 3;

const TONS_BARRA = ["dark", "muted", "light"] as const;

/** Top 3 do ranking: posição, score e as duas métricas que mais pesam. */
export function RankingCard({ ranking }: { ranking: DestinoComScore[] }) {
  return (
    <section className="flex flex-col gap-stack">
      <SectionHeading title="Ranking de destinos" />

      <Card>
        <ol className="flex flex-col gap-block">
          {ranking.slice(0, MAX_ITENS).map(({ destino, score }, indice) => (
            <li key={destino.slug}>
              <Link
                href={`/destinos/${destino.slug}`}
                className="group flex flex-col gap-inline"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-sm ${
                      indice === 0
                        ? "bg-brand-500 text-paper"
                        : "bg-surface-500 text-ink"
                    }`}
                  >
                    {indice + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-serif text-lg text-ink group-hover:underline">
                    {destino.cidade}
                  </span>
                  <span className="font-serif text-lg text-ink">{score}</span>
                </div>

                <ScoreBar
                  value={score}
                  label={`Score de ${destino.cidade}`}
                  tone={TONS_BARRA[indice]}
                />

                <p className="flex flex-wrap items-center gap-x-stack gap-y-1 font-sans text-[11px] font-medium text-text-muted-500">
                  <span className="inline-flex items-center gap-1">
                    <Thermometer className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    {temperaturaMedia(destino.clima)}°C
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    {NIVEL_CUSTO[nivelDeCusto(destino.custoDiarioBRL)].label}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
