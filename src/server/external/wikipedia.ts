import "server-only";

import { normalizar } from "@/features/destinos/utils/catalogo";

/** A foto de capa de um verbete muda raramente. */
const CACHE_FOTO_S = 30 * 24 * 60 * 60;
const TIMEOUT_MS = 5_000;

type RespostaResumo = {
  type: string;
  description?: string;
  originalimage?: { source: string };
};

/** A Wikimedia pede um User-Agent que identifique o cliente. */
const CABECALHOS = { "User-Agent": "TravelHub/0.1 (projeto de estudo)" };

async function buscarResumo(titulo: string): Promise<RespostaResumo | null> {
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`;
  try {
    const resposta = await fetch(url, {
      headers: CABECALHOS,
      next: { revalidate: CACHE_FOTO_S },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return resposta.ok ? ((await resposta.json()) as RespostaResumo) : null;
  } catch {
    return null;
  }
}

/**
 * Foto de capa da cidade, do verbete na Wikipedia em português. Procura
 * "Cidade (Estado)" primeiro, porque "Bonito" sozinho é uma página de
 * desambiguação, e só aceita o verbete se a descrição citar o estado.
 *
 * As fotos são da Wikimedia Commons, com licenças livres que pedem crédito.
 *
 * @returns URL da imagem, ou `null` se não achar.
 */
export async function findCityPhoto(cidade: string, estado: string): Promise<string | null> {
  for (const titulo of [`${cidade} (${estado})`, cidade]) {
    const resumo = await buscarResumo(titulo);
    const descricao = normalizar(resumo?.description ?? "");

    if (
      resumo?.type === "standard" &&
      descricao.includes(normalizar(estado)) &&
      resumo.originalimage?.source
    ) {
      return resumo.originalimage.source;
    }
  }
  return null;
}
