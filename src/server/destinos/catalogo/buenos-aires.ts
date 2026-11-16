import type { Destino } from "@/features/destinos/types/destino";

export const buenosAires: Destino = {
  slug: "buenos-aires",
  cidade: "Buenos Aires",
  pais: "Argentina",
  codigoPais: "AR",
  continente: "América do Sul",
  tema: "Tango & Cafés",
  frase: "Cafés centenários, livrarias monumentais e tango nas esquinas.",
  resumo:
    "Capital cultural com ótima gastronomia e custo acessível para quem viaja do Brasil.",
  descricao:
    "Buenos Aires tem arquitetura europeia, cafés históricos e uma cena cultural intensa, de teatros e livrarias a casas de tango. A gastronomia de carnes e empanadas e os preços moderados em reais fazem da cidade uma boa aposta para quem quer cultura sem estourar o orçamento.",
  imagem: "/destinos/buenos-aires.jpg",
  nota: 8.8,
  clima: {
    minC: 10,
    maxC: 28,
    tipo: "parcial",
    descricao: "Variável",
    diasChuvososPct: 30,
  },
  melhorEpoca: { estacao: "Primavera", meses: [9, 10, 11] },
  moeda: { codigo: "ARS", base: 1000, cotacaoBRL: 3.5 },
  custoDiarioBRL: 300,
  afinidade: {
    natureza: 5,
    cultura: 10,
    gastronomia: 9,
    familia: 7,
    romance: 8,
    economia: 8,
  },
  vibe: ["Boêmio", "Cultural"],
  pontosFortes: [
    "Cena cultural e gastronômica intensa",
    "Custo diário abaixo de várias capitais europeias",
  ],
  pontosDeAtencao: [
    "O câmbio oscila e pode alterar o custo real da viagem",
    "Verão úmido e abafado entre janeiro e fevereiro",
  ],
  pontosDeInteresse: [
    {
      id: "obelisco",
      nome: "Obelisco e Avenida 9 de Julho",
      categoria: "Ícone",
      descricao:
        "O cartão-postal da cidade, no cruzamento da avenida mais larga do mundo.",
      imagem: "/destinos/buenos-aires-obelisco.jpg",
    },
    {
      id: "recoleta",
      nome: "Recoleta",
      categoria: "Histórico",
      descricao:
        "Bairro elegante com o cemitério histórico, feiras de artesanato e cafés centenários.",
    },
    {
      id: "teatro-colon",
      nome: "Teatro Colón",
      categoria: "Cultura",
      descricao:
        "Uma das casas de ópera mais bonitas do mundo, com visitas guiadas diárias.",
    },
  ],
  experiencias: [
    {
      id: "tango-com-jantar",
      titulo: "Show de tango com jantar",
      descricao:
        "Noite em casa de tango tradicional, com jantar de três tempos e apresentação ao vivo.",
      categoria: "noturno",
      perfis: ["casal"],
      preco: 100000,
      duracao: "3 horas",
      nivel: "Clássico",
    },
    {
      id: "parrilla-em-palermo",
      titulo: "Parrilla clássica em Palermo",
      descricao:
        "Cortes argentinos na brasa, empanadas e vinho Malbec em uma parrilla de bairro.",
      categoria: "gastronomia",
      perfis: ["familia", "casal", "sozinho"],
      preco: 45000,
      duracao: "2 horas",
      nivel: "Clássico",
    },
    {
      id: "cafes-e-livrarias",
      titulo: "Cafés históricos e livrarias",
      descricao:
        "Roteiro pelos cafés notáveis do centro e pela livraria El Ateneo, instalada em um antigo teatro.",
      categoria: "cultura",
      perfis: ["sozinho", "casal"],
      preco: 25000,
      duracao: "3 horas",
      nivel: "Tranquilo",
    },
    {
      id: "costanera-sur",
      titulo: "Bicicleta na Reserva Costanera Sur",
      descricao:
        "Pedal por trilhas à beira do Rio da Prata, em uma reserva de aves a poucos minutos do centro.",
      categoria: "natureza",
      perfis: ["familia", "sozinho"],
      preco: 20000,
      duracao: "3 horas",
      nivel: "Fácil",
    },
  ],
};
