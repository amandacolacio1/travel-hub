import { ArrowRight, Landmark } from "lucide-react";
import Link from "next/link";
import { Badge, CoverImage, SectionHeading } from "@/shared/components/ui";
import type { Destino } from "../types/destino";

export function PontosDeInteresse({ destino }: { destino: Destino }) {
  return (
    <section className="flex flex-col gap-stack">
      <SectionHeading
        title="Pontos de interesse"
        description="Curadoria Travel Hub para uma experiência autêntica."
        action={
          <Link
            href={`/explorar?destino=${destino.slug}`}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-ink underline-offset-2 hover:underline"
          >
            Ver experiências
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        }
      />

      <ul className="grid gap-block sm:grid-cols-2 lg:grid-cols-3">
        {destino.pontosDeInteresse.map((ponto) => (
          <li key={ponto.id} className="flex flex-col gap-inline">
            <CoverImage
              src={ponto.imagem}
              alt={ponto.nome}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              fallbackIcon={Landmark}
              className="aspect-[4/5] w-full rounded-card"
            >
              <Badge tone="glass" className="absolute top-3 right-3">
                {ponto.categoria}
              </Badge>
            </CoverImage>

            <h3 className="font-sans text-sm font-semibold text-ink">
              {ponto.nome}
            </h3>
            <p className="font-sans text-xs leading-relaxed text-text-muted-400">
              {ponto.descricao}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
