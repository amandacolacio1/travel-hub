import { ArrowRight } from "lucide-react";
import { Badge, ButtonLink, CoverImage, Eyebrow } from "@/shared/components/ui";
import type { DestinoComScore } from "@/features/destinos/types/destino";
import {
  formatarBRL,
  periodoDosMeses,
  temperaturaMedia,
} from "@/features/destinos/utils/formatadores";

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-paper/20 bg-paper/10 p-stack backdrop-blur-sm">
      <Eyebrow tone="onImage" className="text-[10px]">
        {label}
      </Eyebrow>
      <span className="font-serif text-xl text-paper">{value}</span>
    </div>
  );
}

/** Destino número 1 do ranking, em destaque no topo do dashboard. */
export function DestaqueHero({ item }: { item: DestinoComScore }) {
  const { destino, score } = item;

  return (
    <CoverImage
      src={destino.imagem}
      alt={`${destino.cidade}, ${destino.estado}`}
      sizes="(min-width: 1024px) 70vw, 100vw"
      priority
      className="flex min-h-[22rem] flex-col justify-end rounded-card shadow-card lg:min-h-[24rem]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-500/90 via-brand-500/50 to-brand-500/15"
      />

      <div className="relative flex flex-col gap-block p-card-lg lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-xl flex-col gap-stack">
          <div className="flex flex-wrap gap-inline">
            <Badge tone="success">Melhor opção para você</Badge>
            <Badge tone="glass">Travel Score: {score}/100</Badge>
          </div>

          <h2 className="font-serif text-3xl text-paper">
            {destino.cidade}, {destino.uf}
          </h2>
          <p className="font-sans text-sm leading-relaxed font-semibold text-paper">
            {destino.resumo}
          </p>

          <ButtonLink
            href={`/destinos/${destino.slug}`}
            variant="secondary"
            size="sm"
            className="self-start"
          >
            Ver destino
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </ButtonLink>
        </div>

        <dl className="grid grid-cols-2 gap-inline sm:max-w-sm lg:w-[22rem] lg:shrink-0">
          <HeroStat label="Score" value={String(score)} />
          <HeroStat label="Clima" value={`${temperaturaMedia(destino.clima)}°C`} />
          <HeroStat
            label="Custo/dia"
            value={formatarBRL(destino.custoDiarioBRL)}
          />
          <HeroStat
            label="Melhor época"
            value={periodoDosMeses(destino.melhorEpoca.meses)}
          />
        </dl>
      </div>
    </CoverImage>
  );
}
