import "server-only";

import { DESTINATIONS } from "@/features/auth/constants/destinations";
import { normalizar } from "@/features/destinos/utils/catalogo";
import { listarDestinos } from "@/server/destinos/catalogo";

type PaisConhecido = {
  codigo: string;
  nome: string;
  cidades: string[];
  moeda: string | null;
};

export type DestinoResolvido = {
  codigoPais: string;
  pais: string;
  cidade: string;
  moeda: string | null;
  bandeiraUrl: string;
};

/**
 * Moeda dos países do cadastro que não estão no catálogo editorial. O PDF
 * previa o REST Countries para isso, mas a v5 dele exige chave de API; para
 * meia dúzia de países, um mapa fixo resolve sem dependência externa.
 */
const MOEDA_DO_CADASTRO: Record<string, string> = {
  BR: "BRL",
  PT: "EUR",
  IT: "EUR",
  ES: "EUR",
  FR: "EUR",
  JP: "JPY",
};

/**
 * Países que o app conhece hoje: os do cadastro (`DESTINATIONS`) somados aos
 * do catálogo editorial. Para usar uma API de países no futuro, esta é a
 * única função que muda.
 */
function montarPaises(): PaisConhecido[] {
  const paises = new Map<string, PaisConhecido>();

  for (const { codigo, nome, cidades } of DESTINATIONS) {
    paises.set(codigo, {
      codigo,
      nome,
      cidades: [...cidades],
      moeda: MOEDA_DO_CADASTRO[codigo] ?? null,
    });
  }

  for (const destino of listarDestinos()) {
    const pais = paises.get(destino.codigoPais) ?? {
      codigo: destino.codigoPais,
      nome: destino.pais,
      cidades: [],
      moeda: null,
    };
    if (!pais.cidades.some((c) => normalizar(c) === normalizar(destino.cidade))) {
      pais.cidades.push(destino.cidade);
    }
    pais.moeda ??= destino.moeda.codigo;
    paises.set(destino.codigoPais, pais);
  }

  return [...paises.values()];
}

const PAISES = montarPaises();

/** Bandeira em SVG pelo código ISO (flagcdn.com, sem chave). */
function urlDaBandeira(codigoPais: string): string {
  return `https://flagcdn.com/${codigoPais.toLowerCase()}.svg`;
}

/**
 * Converte o `{ pais, cidade }` que o front envia no formato da tabela
 * `destinos`. O código do país é decidido aqui, nunca aceito do cliente, e a
 * grafia é a canônica ("toquio" → "Tóquio") para a chave única
 * `codigo_pais + cidade` não duplicar o mesmo lugar.
 */
export function resolveDestination(
  pais: string,
  cidade: string,
): DestinoResolvido | null {
  const conhecido = PAISES.find((p) => normalizar(p.nome) === normalizar(pais));
  if (!conhecido) return null;

  const cidadeCanonica = conhecido.cidades.find(
    (c) => normalizar(c) === normalizar(cidade),
  );

  return {
    codigoPais: conhecido.codigo,
    pais: conhecido.nome,
    cidade: cidadeCanonica ?? cidade.trim(),
    moeda: conhecido.moeda,
    bandeiraUrl: urlDaBandeira(conhecido.codigo),
  };
}
