import { Star, Trash2 } from "lucide-react";
import type { DestinoDesejado } from "@/features/auth/types/auth";
import { Badge, ButtonLink, Card, CoverImage } from "@/shared/components/ui";
import type { Destino } from "../types/destino";
import { formatarNota } from "../utils/formatadores";

type DestinoSalvoCardProps = {
  desejado: DestinoDesejado;
  /** Indefinido quando a cidade escolhida ainda não existe no catálogo. */
  destino?: Destino;
  onRemover: () => void;
};

export function DestinoSalvoCard({
  desejado,
  destino,
  onRemover,
}: DestinoSalvoCardProps) {
  return (
    <Card padding="none" className="flex w-full flex-col overflow-hidden">
      <CoverImage
        src={destino?.imagem}
        alt={`${desejado.cidade}, ${desejado.pais}`}
        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
        className="h-36 w-full"
      >
        {destino ? (
          <>
            <Badge tone="dark" className="absolute top-3 left-3">
              {destino.continente}
            </Badge>
            <Badge tone="glass" className="absolute top-3 right-3">
              <Star className="h-3 w-3 fill-current" strokeWidth={1.5} aria-hidden />
              {formatarNota(destino.nota)}
            </Badge>
          </>
        ) : null}
      </CoverImage>

      <div className="flex flex-1 flex-col gap-stack p-card">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl text-ink">{desejado.cidade}</h3>
          <p className="font-sans text-xs text-text-muted-400">
            {destino
              ? `${destino.pais} • ${destino.tema}`
              : `${desejado.pais} • Ainda sem detalhes no catálogo`}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-inline border-t border-surface-600 pt-stack">
          {destino ? (
            <ButtonLink
              href={`/destinos/${destino.slug}`}
              variant="soft"
              size="sm"
              className="flex-1"
            >
              Ver detalhes
            </ButtonLink>
          ) : (
            <span className="flex-1" />
          )}
          <button
            type="button"
            onClick={onRemover}
            aria-label={`Remover ${desejado.cidade} da lista`}
            className="cursor-pointer rounded-md p-2 text-text-muted-400 transition-colors hover:bg-error-100 hover:text-error-700"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </Card>
  );
}
