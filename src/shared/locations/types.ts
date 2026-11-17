/** Estado brasileiro, como o `GET /api/localidades/estados` devolve. */
export type BrazilState = {
  /** Sigla da unidade federativa, ex.: "BA". */
  uf: string;
  nome: string;
  /** Região do IBGE, ex.: "Nordeste". */
  regiao: string;
};

/** Município, como o `GET /api/localidades/estados/[uf]/cidades` devolve. */
export type BrazilCity = {
  /** Código do município no IBGE (7 dígitos). */
  ibgeId: number;
  nome: string;
};
