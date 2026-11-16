import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Badge,
  Card,
  CoverImage,
  Eyebrow,
  ScoreBar,
} from "@/shared/components/ui";
import { ClimaIcone } from "@/features/destinos/components/clima-icone";
import { NIVEL_CUSTO } from "@/features/destinos/constants/rotulos";
import type { DestinoComScore } from "@/features/destinos/types/destino";
import {
  faixaDeClima,
  formatarBRL,
  nivelDeCusto,
  periodoDosMeses,
} from "@/features/destinos/utils/formatadores";
import { MAX_COMPARADOR } from "../hooks/use-comparador";

type Linha = {
  titulo: string;
  celula: (item: DestinoComScore) => ReactNode;
};

const LINHAS: Linha[] = [
  {
    titulo: "Score",
    celula: ({ destino, score }) => (
      <div className="flex items-center gap-inline">
        <span className="font-sans text-sm font-semibold text-ink">{score}</span>
        <ScoreBar
          value={score}
          label={`Score de ${destino.cidade}`}
          className="max-w-16"
        />
      </div>
    ),
  },
  {
    titulo: "Clima",
    celula: ({ destino: { clima } }) => (
      <div className="flex items-start gap-inline">
        <ClimaIcone tipo={clima.tipo} className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {faixaDeClima(clima)}
          <span className="block text-text-muted-400">({clima.descricao})</span>
        </span>
      </div>
    ),
  },
  {
    titulo: "Custo",
    celula: ({ destino }) => {
      const nivel = NIVEL_CUSTO[nivelDeCusto(destino.custoDiarioBRL)];

      return (
        <div className="flex flex-col items-start gap-1">
          <Badge tone={nivel.tone}>{nivel.label}</Badge>
          <span className="text-text-muted-400">
            {formatarBRL(destino.custoDiarioBRL)}/dia
          </span>
        </div>
      );
    },
  },
  {
    titulo: "Temporada",
    celula: ({ destino: { melhorEpoca } }) => (
      <span>
        {melhorEpoca.estacao}
        <span className="block text-text-muted-400">
          {periodoDosMeses(melhorEpoca.meses)}
        </span>
      </span>
    ),
  },
  {
    titulo: "Vibe",
    celula: ({ destino }) => destino.vibe.join(", "),
  },
];

const CELULA = "p-3 align-top sm:p-card";
/** Coluna de métricas fixa à esquerda enquanto a tabela rola no mobile. */
const COLUNA_FIXA = "sticky left-0 z-10 w-24 sm:w-32";
const LARGURA_METRICAS_REM = 6;
const LARGURA_DESTINO_REM = 10;

type TabelaComparativaProps = {
  itens: DestinoComScore[];
  /** Abre o modal de adicionar destino (só chamado enquanto houver vaga). */
  onAdicionar: () => void;
};

export function TabelaComparativa({ itens, onAdicionar }: TabelaComparativaProps) {
  const temVaga = itens.length < MAX_COMPARADOR;
  const colunas = itens.length + (temVaga ? 1 : 0);

  return (
    <Card padding="none" className="overflow-x-auto">
      <table
        className="w-full table-fixed border-collapse text-left"
        style={{
          minWidth: `${LARGURA_METRICAS_REM + colunas * LARGURA_DESTINO_REM}rem`,
        }}
      >
        <caption className="sr-only">Comparação entre os destinos escolhidos</caption>

        <thead>
          <tr className="bg-surface-alt-500">
            <th
              scope="col"
              className={`${COLUNA_FIXA} bg-surface-alt-500 ${CELULA} align-middle font-normal`}
            >
              <Eyebrow>Métricas</Eyebrow>
            </th>

            {itens.map(({ destino }) => (
              <th key={destino.slug} scope="col" className={`${CELULA} align-bottom font-normal`}>
                <Link
                  href={`/destinos/${destino.slug}`}
                  className="group flex flex-col gap-inline"
                >
                  <CoverImage
                    src={destino.imagem}
                    alt=""
                    sizes="200px"
                    className="aspect-[16/10] w-full max-w-44 rounded-lg"
                  />
                  <span className="font-serif text-base text-ink group-hover:underline">
                    {destino.cidade}
                  </span>
                </Link>
              </th>
            ))}

            {temVaga ? (
              <th scope="col" className={`${CELULA} align-middle font-normal`}>
                <button
                  type="button"
                  onClick={onAdicionar}
                  className="flex h-full min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-inline rounded-lg border border-dashed border-surface-700 p-stack text-center font-sans text-xs text-text-muted-500 transition-colors hover:border-brand-500 hover:text-ink"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  Adicionar {itens.length + 1}º destino
                </button>
              </th>
            ) : null}
          </tr>
        </thead>

        <tbody className="font-sans text-xs text-ink">
          {LINHAS.map(({ titulo, celula }) => (
            <tr key={titulo} className="border-t border-surface-600">
              <th
                scope="row"
                className={`${COLUNA_FIXA} bg-paper ${CELULA} font-serif text-sm font-normal`}
              >
                {titulo}
              </th>
              {itens.map((item) => (
                <td key={item.destino.slug} className={CELULA}>
                  {celula(item)}
                </td>
              ))}
              {temVaga ? (
                <td className={`${CELULA} text-text-muted-400`} aria-hidden>
                  –
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
