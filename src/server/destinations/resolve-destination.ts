import "server-only";

import { normalizar, slugDoDestino } from "@/features/destinos/utils/catalogo";
import { listCities, listStates } from "@/server/external/ibge";
import { HttpError } from "@/server/http/http-error";

export type DestinoResolvido = {
  slug: string;
  uf: string;
  estado: string;
  regiao: string;
  cidade: string;
  ibgeId: number;
};

/**
 * Converte o `{ uf, cidade }` que o front envia no formato da tabela
 * `destinos`, conferindo no IBGE que a cidade existe naquele estado. A grafia
 * gravada é a do IBGE ("sao paulo" → "São Paulo"), e o código do município é
 * a chave única: o mesmo lugar nunca vira duas linhas.
 *
 * Faz chamadas de rede, então deve rodar antes de abrir uma transação.
 *
 * @returns `null` se o estado ou a cidade não existirem.
 * @throws HttpError 503 se o IBGE estiver fora do ar.
 */
export async function resolveDestination(
  uf: string,
  cidade: string,
): Promise<DestinoResolvido | null> {
  const [estados, cidades] = await Promise.all([listStates(), listCities(uf)]);
  if (!estados || !cidades) {
    throw new HttpError(503, "Não foi possível validar a cidade agora. Tente de novo.");
  }

  const estado = estados.find((item) => item.uf === uf.toUpperCase());
  const municipio = cidades.find((item) => normalizar(item.nome) === normalizar(cidade));
  if (!estado || !municipio) return null;

  return {
    slug: slugDoDestino(municipio.nome, estado.uf),
    uf: estado.uf,
    estado: estado.nome,
    regiao: estado.regiao,
    cidade: municipio.nome,
    ibgeId: municipio.ibgeId,
  };
}

/** Como `resolveDestination`, mas cidade desconhecida vira 400. */
export async function resolveDestinationOrThrow(
  uf: string,
  cidade: string,
): Promise<DestinoResolvido> {
  const destino = await resolveDestination(uf, cidade);
  if (!destino) {
    throw new HttpError(400, `Cidade não encontrada: ${cidade} (${uf})`);
  }
  return destino;
}
