export type CountryOption = {
  codigo: string;
  nome: string;
  cidades: string[];
};

export const DESTINATIONS: CountryOption[] = [
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

export const BUDGET_MIN = 1000;
export const BUDGET_MAX = 50000;
export const MAX_DESTINATIONS = 4;
