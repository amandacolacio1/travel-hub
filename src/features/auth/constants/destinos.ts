export type PaisOption = {
  codigo: string;
  nome: string;
  cidades: string[];
};

export const DESTINOS: PaisOption[] = [
  {
    codigo: "BR",
    nome: "Brasil",
    cidades: ["São Paulo", "Rio de Janeiro", "Salvador", "Florianópolis", "Brasília"],
  },
  {
    codigo: "PT",
    nome: "Portugal",
    cidades: ["Lisboa", "Porto", "Faro", "Coimbra"],
  },
  {
    codigo: "IT",
    nome: "Itália",
    cidades: ["Roma", "Milão", "Florença", "Veneza", "Nápoles"],
  },
  {
    codigo: "ES",
    nome: "Espanha",
    cidades: ["Madri", "Barcelona", "Sevilha", "Valência"],
  },
  {
    codigo: "FR",
    nome: "França",
    cidades: ["Paris", "Lyon", "Nice", "Marselha"],
  },
  {
    codigo: "JP",
    nome: "Japão",
    cidades: ["Tóquio", "Osaka", "Kyoto", "Hiroshima"],
  },
];

export const ORCAMENTO_MIN = 1000;
export const ORCAMENTO_MAX = 50000;
export const MAX_DESTINOS = 4;
