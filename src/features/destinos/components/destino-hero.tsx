import { Breadcrumb, CoverImage } from "@/shared/components/ui";
import type { Destino } from "../types/destino";

export function DestinoHero({ destino }: { destino: Destino }) {
  return (
    <CoverImage
      src={destino.imagem}
      alt={`${destino.cidade}, ${destino.estado}`}
      sizes="(min-width: 1280px) 1100px, 100vw"
      priority
      className="flex h-72 flex-col justify-end rounded-card pb-16 sm:h-80 lg:h-96 lg:pb-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-500/90 via-brand-500/50 to-brand-500/10"
      />

      <div className="relative flex flex-col gap-inline px-card-lg lg:px-8">
        <Breadcrumb
          tone="onImage"
          items={[
            { label: "Destinos", href: "/destinos" },
            { label: destino.estado },
            { label: destino.cidade },
          ]}
        />
        <h1 className="font-serif text-4xl text-paper">
          {destino.cidade}, {destino.uf}
        </h1>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-paper/85 italic">
          “{destino.frase}”
        </p>
      </div>
    </CoverImage>
  );
}
