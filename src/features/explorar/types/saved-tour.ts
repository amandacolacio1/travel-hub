/** Passeio marcado com ♡, como o `GET /api/passeios-salvos` devolve. */
export type SavedTour = {
  /** Id do passeio na fonte externa (hoje, o id da experiência no catálogo). */
  apiId: string;
  titulo: string;
  descricao: string;
  categoria: string;
  /** Em reais. */
  preco: number;
  imagemUrl: string | null;
  destino: { slug: string; uf: string; cidade: string };
  /** ISO 8601. */
  salvoEm: string;
};
