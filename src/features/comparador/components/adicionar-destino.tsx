import { MapPin } from "lucide-react";
import { Chip, Eyebrow, SearchableSelect } from "@/shared/components/ui";
import type { Destino } from "@/features/destinos/types/destino";
import { bandeira } from "@/features/destinos/utils/formatadores";
import { MAX_COMPARADOR } from "../hooks/use-comparador";

type AdicionarDestinoProps = {
  selecionados: Destino[];
  disponiveis: Destino[];
  cheio: boolean;
  onAdicionar: (slug: string) => void;
  onRemover: (slug: string) => void;
};

/** Seletor de destinos, chips removíveis e indicador de capacidade (X/4). */
export function AdicionarDestino({
  selecionados,
  disponiveis,
  cheio,
  onAdicionar,
  onRemover,
}: AdicionarDestinoProps) {
  return (
    <div className="flex flex-col gap-stack">
      <div className="flex flex-col gap-stack sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-inline sm:max-w-sm">
          <Eyebrow>Adicionar destino</Eyebrow>
          <SearchableSelect
            value=""
            disabled={cheio}
            placeholder={
              cheio ? "Limite de destinos atingido" : "Buscar por cidade ou país…"
            }
            searchPlaceholder="Buscar destino"
            emptyMessage="Nenhum destino disponível"
            options={disponiveis.map((destino) => ({
              value: destino.slug,
              label: `${destino.cidade}, ${destino.pais}`,
              prefix: bandeira(destino.codigoPais),
            }))}
            onChange={onAdicionar}
          />
        </div>

        <div
          className="flex items-center gap-inline sm:flex-col sm:items-end"
          aria-label={`Capacidade: ${selecionados.length} de ${MAX_COMPARADOR} destinos`}
        >
          <Eyebrow>Capacidade</Eyebrow>
          <div className="flex items-center gap-inline">
            <span aria-hidden className="flex gap-1">
              {Array.from({ length: MAX_COMPARADOR }, (_, indice) => (
                <span
                  key={indice}
                  className={`h-2 w-2 rounded-full ${
                    indice < selecionados.length ? "bg-brand-500" : "bg-surface-700"
                  }`}
                />
              ))}
            </span>
            <span className="font-sans text-xs font-semibold text-ink">
              {selecionados.length}/{MAX_COMPARADOR}
            </span>
          </div>
        </div>
      </div>

      {selecionados.length > 0 ? (
        <ul className="flex flex-wrap gap-inline">
          {selecionados.map((destino) => (
            <li key={destino.slug}>
              <Chip
                icon={<MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                onRemove={() => onRemover(destino.slug)}
                removeLabel={`Remover ${destino.cidade}`}
              >
                {destino.cidade}
              </Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
