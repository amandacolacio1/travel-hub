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

/** Destino do catálogo que corresponde a um destino escolhido no cadastro. */
export function encontrarDestino(
  catalogo: Destino[],
  { pais, cidade }: DestinoDesejado,
): Destino | undefined {
  return catalogo.find(
    (destino) =>
      normalizar(destino.cidade) === normalizar(cidade) &&
      normalizar(destino.pais) === normalizar(pais),
  );
}

export function mesmoDestino(a: DestinoDesejado, b: DestinoDesejado): boolean {
  return (
    normalizar(a.cidade) === normalizar(b.cidade) &&
    normalizar(a.pais) === normalizar(b.pais)
  );
}
