import type { DestinoDesejado } from "@/features/auth/types/auth";
import type { Destino } from "../types/destino";

/** Remove acentos e caixa para comparar nomes digitados com os do catálogo. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

/** `"Pão de Açúcar!"` → `"pao-de-acucar"`. */
export function slugificar(texto: string): string {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** `("São Paulo", "SP")` → `"sao-paulo-sp"`. A UF evita colisão entre homônimas. */
export function slugDoDestino(cidade: string, uf: string): string {
  return `${slugificar(cidade)}-${uf.toLowerCase()}`;
}

export function mesmoDestino(a: DestinoDesejado, b: DestinoDesejado): boolean {
  return (
    normalizar(a.cidade) === normalizar(b.cidade) &&
    a.uf.toUpperCase() === b.uf.toUpperCase()
  );
}

/** Destino do catálogo que corresponde a um destino escolhido no cadastro. */
export function encontrarDestino(
  catalogo: Destino[],
  desejado: DestinoDesejado,
): Destino | undefined {
  return catalogo.find((destino) => mesmoDestino(destino, desejado));
}
