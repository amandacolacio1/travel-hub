import "server-only";

import { slugificar } from "@/features/destinos/utils/catalogo";
import type { DestinoResolvido } from "@/server/destinations/resolve-destination";
import { findCityPhoto } from "@/server/external/wikipedia";
import {
  type DestinationProfile,
  destinationProfileSchema,
} from "./destination-profile.schema";
import { fakeProfileGenerator } from "./fake-profile-generator";

type Gerador = (destino: DestinoResolvido) => DestinationProfile | Promise<DestinationProfile>;

/**
 * Geradores disponíveis, escolhidos por `AI_PROVIDER` no `.env`. Para plugar
 * uma IA (Ollama, Claude…), basta uma função com a mesma assinatura aqui.
 */
const GERADORES = {
  fake: fakeProfileGenerator,
} satisfies Record<string, Gerador>;

export type ProfileSource = keyof typeof GERADORES;

/** Sem `AI_PROVIDER`, usa o gerador falso: o app roda sem chave nenhuma. */
export function currentProfileSource(): ProfileSource {
  const escolhido = process.env.AI_PROVIDER?.trim() || "fake";
  if (!(escolhido in GERADORES)) {
    throw new Error(
      `AI_PROVIDER inválido: "${escolhido}". Use um de: ${Object.keys(GERADORES).join(", ")}.`,
    );
  }
  return escolhido as ProfileSource;
}

/**
 * Ids de pontos e experiências viram `slug-da-cidade--slug-do-titulo-N`. Os ids
 * das experiências são o `apiId` de `passeios` (único no banco), então não
 * podem colidir entre cidades nem depender do que o gerador inventou.
 */
function normalizarIds(destino: DestinoResolvido, ficha: DestinationProfile): DestinationProfile {
  const idDe = (titulo: string, indice: number) =>
    `${destino.slug}--${slugificar(titulo)}-${indice + 1}`;

  return {
    ...ficha,
    pontosDeInteresse: ficha.pontosDeInteresse.map((ponto, i) => ({
      ...ponto,
      id: idDe(ponto.nome, i),
    })),
    experiencias: ficha.experiencias.map((experiencia, i) => ({
      ...experiencia,
      id: idDe(experiencia.titulo, i),
    })),
  };
}

/**
 * Gera a ficha de uma cidade com o gerador configurado, completa a foto
 * (Wikipedia) e valida o resultado. Lança se a ficha não passar no schema.
 */
export async function generateDestinationProfile(destino: DestinoResolvido): Promise<{
  ficha: DestinationProfile;
  fonte: ProfileSource;
}> {
  const fonte = currentProfileSource();

  const [bruta, foto] = await Promise.all([
    GERADORES[fonte](destino),
    findCityPhoto(destino.cidade, destino.estado),
  ]);

  const ficha = destinationProfileSchema.parse(
    normalizarIds(destino, { ...bruta, imagem: foto ?? bruta.imagem }),
  );
  return { ficha, fonte };
}
