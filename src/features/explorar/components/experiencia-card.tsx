import { Clock, Gauge, Star } from "lucide-react";
import { Badge, Card, CoverImage, Eyebrow } from "@/shared/components/ui";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import { CATEGORIAS_EXPERIENCIA } from "@/features/destinos/constants/rotulos";
import type { Destino, Experiencia } from "@/features/destinos/types/destino";
import { formatarBRL } from "@/features/destinos/utils/formatadores";
import { SaveTourButton } from "./save-tour-button";

type ExperienciaCardProps = {
  experiencia: Experiencia;
  destino: Destino;
  combina: boolean;
  salvo: boolean;
  onSelect: () => void;
  onToggleSalvo: () => void;
};

export function rotuloCategoria({ categoria, perfis }: Experiencia): string {
  const categoriaLabel =
    CATEGORIAS_EXPERIENCIA.find((item) => item.id === categoria)?.label ??
    categoria;
  const perfisLabel = perfis
    .map((id) => TRAVEL_PROFILES.find((perfil) => perfil.id === id)?.titulo)
    .filter(Boolean)
    .join(", ");

  return `${categoriaLabel} • ${perfisLabel}`;
}

/**
 * Card clicável: abre o detalhe da experiência em um modal. O ♡ é um botão
 * irmão posicionado por cima — botão dentro de botão é HTML inválido.
 */
export function ExperienciaCard({
  experiencia,
  destino,
  combina,
  salvo,
  onSelect,
  onToggleSalvo,
}: ExperienciaCardProps) {
  return (
    <div className="relative flex w-full min-w-0">
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full min-w-0 cursor-pointer rounded-card text-left"
      >
        <Card
          padding="none"
          className="flex w-full min-w-0 flex-col overflow-hidden transition-shadow hover:shadow-lg"
        >
          <CoverImage
            src={experiencia.imagem ?? destino.imagem}
            alt={experiencia.titulo}
            sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/3] w-full"
          >
            {combina ? (
              <Badge tone="dark" className="absolute top-stack left-stack">
                <Star className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                Match perfeito
              </Badge>
            ) : null}
          </CoverImage>

          <div className="flex flex-1 flex-col gap-stack p-card">
            <div className="flex items-start justify-between gap-stack">
              <div className="flex min-w-0 flex-col gap-1">
                <Eyebrow className="truncate text-[10px]">
                  {rotuloCategoria(experiencia)}
                </Eyebrow>
                <h3 className="font-serif text-lg text-ink">
                  {experiencia.titulo}
                </h3>
              </div>

              <div className="flex shrink-0 flex-col items-end">
                <Eyebrow className="text-[9px]">A partir de</Eyebrow>
                <span className="font-serif text-xl text-ink">
                  {formatarBRL(experiencia.preco)}
                </span>
              </div>
            </div>

            {/* No mobile o card fica enxuto; a descrição completa está no modal. */}
            <p className="hidden flex-1 font-sans text-sm leading-relaxed text-text-muted-400 sm:block">
              {experiencia.descricao}
            </p>

            <ul className="mt-auto flex items-center gap-block border-t border-surface-600 pt-stack font-sans text-xs font-medium text-ink">
              <li className="inline-flex items-center gap-1.5">
                <Clock
                  className="h-3.5 w-3.5 text-text-muted-400"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {experiencia.duracao}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Gauge
                  className="h-3.5 w-3.5 text-text-muted-400"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {experiencia.nivel}
              </li>
            </ul>
          </div>
        </Card>
      </button>
      <SaveTourButton
        salvo={salvo}
        titulo={experiencia.titulo}
        onClick={onToggleSalvo}
        className="absolute top-stack right-stack"
      />
    </div>
  );
}
