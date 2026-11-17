import type { InterestOption } from "@/features/auth/constants/interests";
import type { PerfilViagem } from "@/features/auth/types/auth";

/** Mesmos ids dos interesses do cadastro: a afinidade do destino é medida neles. */
export type InteresseId = InterestOption["icon"];

export type ClimaTipo = "sol" | "parcial" | "frio" | "chuva";

export type NivelCusto = "economico" | "moderado" | "alto" | "muito-alto";

export type ExperienciaCategoria =
  | "gastronomia"
  | "natureza"
  | "cultura"
  | "noturno";

export type PontoDeInteresse = {
  id: string;
  nome: string;
  /** Texto curto exibido na etiqueta do card (ex.: "Histórico"). */
  categoria: string;
  descricao: string;
  imagem?: string;
};

export type Experiencia = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: ExperienciaCategoria;
  /** Para quais perfis de viagem a experiência faz sentido. */
  perfis: PerfilViagem[];
  /** Em reais. */
  preco: number;
  duracao: string;
  nivel: string;
  imagem?: string;
};

export type Destino = {
  slug: string;
  cidade: string;
  /** Sigla do estado, ex.: "RJ". */
  uf: string;
  /** Nome do estado, ex.: "Rio de Janeiro". */
  estado: string;
  /** Região do IBGE, ex.: "Sudeste". */
  regiao: string;
  tema: string;
  frase: string;
  resumo: string;
  descricao: string;
  imagem: string;
  /** Avaliação editorial de 0 a 10. */
  nota: number;
  clima: {
    minC: number;
    maxC: number;
    tipo: ClimaTipo;
    descricao: string;
    diasChuvososPct: number;
  };
  melhorEpoca: {
    estacao: string;
    /** Meses (1–12) em ordem cronológica. */
    meses: number[];
  };
  /** Referência por pessoa, hospedagem + alimentação, em reais. */
  custoDiarioBRL: number;
  /** Nota de 0 a 10 para cada interesse do cadastro. */
  afinidade: Record<InteresseId, number>;
  vibe: string[];
  pontosFortes: string[];
  pontosDeAtencao: string[];
  pontosDeInteresse: PontoDeInteresse[];
  experiencias: Experiencia[];
};

export type DestinoComScore = {
  destino: Destino;
  /** 0 a 100, calculado a partir das preferências do usuário. */
  score: number;
};
