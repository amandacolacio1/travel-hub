/** Passeio marcado com ♡, como o `GET /api/passeios-salvos` devolve. */
export type SavedTour = {
  /** Id do passeio na fonte externa (hoje, o id da experiência no catálogo). */
  apiId: string;
  titulo: string;
  descricao: string;
  categoria: string;
  /** Na moeda local do destino (`moeda`). */
  preco: number;
  moeda: string | null;
  imagemUrl: string | null;
  destino: { codigoPais: string; pais: string; cidade: string };
  /** ISO 8601. */
  salvoEm: string;
};
