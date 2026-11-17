import "server-only";

import type { ClimaTipo, Experiencia } from "@/features/destinos/types/destino";
import type { DestinoResolvido } from "@/server/destinations/resolve-destination";
import type { DestinationProfile } from "./destination-profile.schema";

/**
 * Gerador de fichas sem IA: monta uma ficha plausível a partir da região e de
 * números derivados do slug. Serve para desenvolver e testar sem custo e sem
 * rede — o conteúdo é de exemplo e diz isso no texto.
 *
 * Determinístico: a mesma cidade sempre gera a mesma ficha.
 */

type ClimaDaRegiao = {
  minC: number;
  maxC: number;
  tipo: ClimaTipo;
  descricao: string;
  diasChuvososPct: number;
  melhorEpoca: { estacao: string; meses: number[] };
};

/** Médias aproximadas por região, para a ficha não ficar absurda. */
const CLIMA_DA_REGIAO: Record<string, ClimaDaRegiao> = {
  Norte: {
    minC: 23,
    maxC: 32,
    tipo: "chuva",
    descricao: "Quente e úmido",
    diasChuvososPct: 55,
    melhorEpoca: { estacao: "Seca", meses: [7, 8, 9] },
  },
  Nordeste: {
    minC: 22,
    maxC: 30,
    tipo: "sol",
    descricao: "Quente",
    diasChuvososPct: 30,
    melhorEpoca: { estacao: "Verão", meses: [9, 10, 11, 12] },
  },
  "Centro-Oeste": {
    minC: 18,
    maxC: 31,
    tipo: "sol",
    descricao: "Quente e seco",
    diasChuvososPct: 35,
    melhorEpoca: { estacao: "Seca", meses: [5, 6, 7, 8] },
  },
  Sudeste: {
    minC: 17,
    maxC: 28,
    tipo: "parcial",
    descricao: "Ameno",
    diasChuvososPct: 40,
    melhorEpoca: { estacao: "Outono", meses: [4, 5, 6] },
  },
  Sul: {
    minC: 11,
    maxC: 23,
    tipo: "frio",
    descricao: "Frio no inverno",
    diasChuvososPct: 45,
    melhorEpoca: { estacao: "Primavera", meses: [10, 11, 12] },
  },
};

/** FNV-1a: transforma o slug num número fixo. */
function hashDoTexto(texto: string): number {
  let hash = 0x811c9dc5;
  for (const caractere of texto) {
    hash ^= caractere.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Sequência pseudoaleatória (mulberry32) a partir de uma semente. */
function sorteador(semente: number) {
  let estado = semente;
  return (min: number, max: number) => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const fracao = ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
    return Math.floor(min + fracao * (max - min + 1));
  };
}

function experienciasDeExemplo(
  destino: DestinoResolvido,
  sortear: (min: number, max: number) => number,
): Experiencia[] {
  const modelos: Omit<Experiencia, "id" | "preco">[] = [
    {
      titulo: `Caminhada pelos arredores de ${destino.cidade}`,
      descricao: "Passeio de exemplo ao ar livre, gerado sem IA.",
      categoria: "natureza",
      perfis: ["sozinho", "casal", "familia"],
      duracao: "3 horas",
      nivel: "Fácil",
    },
    {
      titulo: `Centro histórico de ${destino.cidade}`,
      descricao: "Roteiro cultural de exemplo, gerado sem IA.",
      categoria: "cultura",
      perfis: ["sozinho", "casal", "familia"],
      duracao: "2 horas",
      nivel: "Fácil",
    },
    {
      titulo: `Sabores de ${destino.estado}`,
      descricao: "Experiência gastronômica de exemplo, gerada sem IA.",
      categoria: "gastronomia",
      perfis: ["casal", "familia"],
      duracao: "2 horas",
      nivel: "Clássico",
    },
  ];

  return modelos.map((modelo, indice) => ({
    ...modelo,
    id: `${destino.slug}--exemplo-${indice + 1}`,
    preco: sortear(5, 30) * 10,
  }));
}

export function fakeProfileGenerator(destino: DestinoResolvido): DestinationProfile {
  const sortear = sorteador(hashDoTexto(destino.slug));
  const { melhorEpoca, ...clima } =
    CLIMA_DA_REGIAO[destino.regiao] ?? CLIMA_DA_REGIAO.Sudeste;

  return {
    tema: `Explorando ${destino.cidade}`,
    frase: `${destino.cidade}, ${destino.estado}: ficha de exemplo.`,
    resumo: `Ficha de exemplo para ${destino.cidade} (${destino.uf}), gerada sem IA para testes.`,
    descricao: `Os dados desta ficha são fictícios: o clima é a média da região ${destino.regiao} e as notas são sorteadas a partir do nome da cidade. Configure uma IA para gerar a ficha real.`,
    imagem: "",
    nota: sortear(60, 95) / 10,
    clima,
    melhorEpoca,
    custoDiarioBRL: sortear(20, 60) * 10,
    afinidade: {
      natureza: sortear(4, 10),
      cultura: sortear(4, 10),
      gastronomia: sortear(4, 10),
      familia: sortear(4, 10),
      romance: sortear(4, 10),
      economia: sortear(4, 10),
    },
    vibe: ["Exemplo"],
    pontosFortes: ["Ponto forte de exemplo"],
    pontosDeAtencao: ["Ponto de atenção de exemplo"],
    pontosDeInteresse: [
      {
        id: `${destino.slug}--centro`,
        nome: `Centro de ${destino.cidade}`,
        categoria: "Exemplo",
        descricao: "Ponto de interesse de exemplo, gerado sem IA.",
      },
    ],
    experiencias: experienciasDeExemplo(destino, sortear),
  };
}
