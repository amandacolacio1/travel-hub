export type AuthStep = 1 | 2 | 3;

/** Cidade brasileira escolhida pelo usuário; o servidor confere no IBGE. */
export type DestinoDesejado = {
  /** Sigla do estado, ex.: "BA". */
  uf: string;
  cidade: string;
};

export type ContaDados = {
  nome: string;
  email: string;
  senha: string;
};

export type PreferenciasDados = {
  interesses: string[];
  orcamentoInicial: number;
  orcamentoFinal: number;
  destinos: DestinoDesejado[];
  dataPrevista: string;
};

export type PerfilViagem = "sozinho" | "casal" | "familia";

export type AuthPayload = {
  conta: ContaDados;
  preferencias: PreferenciasDados;
  perfilViagem: PerfilViagem;
};
