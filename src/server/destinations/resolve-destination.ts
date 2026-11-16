import "server-only";

import { DESTINATIONS } from "@/features/auth/constants/destinations";
import { normalizar } from "@/features/destinos/utils/catalogo";
import { listarDestinos } from "@/server/destinos/catalogo";

type PaisConhecido = { codigo: string; nome: string; cidades: string[] };

export type DestinoResolvido = {
  codigoPais: string;
  pais: string;
  cidade: string;
};

/**
 * Países que o app conhece hoje: os do cadastro (`DESTINATIONS`) somados aos
 * do catálogo editorial. Quando a API de países entrar (Fase 5 do guia), esta
 * é a única função que muda.
 */
function montarPaises(): PaisConhecido[] {
  const paises = new Map<string, PaisConhecido>();

  for (const { codigo, nome, cidades } of DESTINATIONS) {
    paises.set(codigo, { codigo, nome, cidades: [...cidades] });
  }

  for (const destino of listarDestinos()) {
    const pais = paises.get(destino.codigoPais) ?? {
      codigo: destino.codigoPais,
      nome: destino.pais,
      cidades: [],
    };
    if (!pais.cidades.some((c) => normalizar(c) === normalizar(destino.cidade))) {
      pais.cidades.push(destino.cidade);
    }
    paises.set(destino.codigoPais, pais);
  }

  return [...paises.values()];
}

const PAISES = montarPaises();

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
  };
}
