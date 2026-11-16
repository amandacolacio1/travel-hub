import type { Destino } from "@/features/destinos/types/destino";

export const bangkok: Destino = {
  slug: "bangkok",
  cidade: "Bangkok",
  pais: "Tailândia",
  codigoPais: "TH",
  continente: "Ásia",
  tema: "Templos & Street Food",
  frase: "Templos dourados, canais e a comida de rua mais celebrada do mundo.",
  resumo:
    "Custo muito baixo, comida de rua e templos monumentais, com calor e umidade quase o ano todo.",
  descricao:
    "Bangkok impressiona pela escala: templos dourados, canais, mercados e uma comida de rua que vai do básico ao premiado. O calor é intenso e o trânsito, pesado, mas o custo diário é um dos mais baixos entre as grandes capitais.",
  imagem: "/destinos/bangkok.jpg",
  nota: 8.7,
  clima: {
    minC: 25,
    maxC: 35,
    tipo: "sol",
    descricao: "Quente e úmido",
    diasChuvososPct: 45,
  },
  melhorEpoca: { estacao: "Inverno seco", meses: [11, 12, 1, 2] },
  moeda: { codigo: "THB", base: 100, cotacaoBRL: 16 },
  custoDiarioBRL: 280,
  afinidade: {
    natureza: 5,
    cultura: 9,
    gastronomia: 10,
    familia: 7,
    romance: 7,
    economia: 10,
  },
  vibe: ["Intenso", "Exótico"],
  pontosFortes: [
    "Um dos menores custos diários do comparativo",
    "Comida de rua e templos de nível mundial",
  ],
  pontosDeAtencao: [
    "Calor e umidade intensos na maior parte do ano",
    "Trânsito pesado: prefira metrô, trem elevado e barcos",
  ],
  pontosDeInteresse: [
    {
      id: "grand-palace",
      nome: "Grand Palace e Wat Pho",
      categoria: "Histórico",
      descricao:
        "O complexo real e o templo do Buda Reclinado, a poucos minutos a pé um do outro.",
    },
    {
      id: "yaowarat",
      nome: "Yaowarat (Chinatown)",
      categoria: "Gastronomia",
      descricao:
        "A avenida da comida de rua, que fica mais viva depois que o sol se põe.",
      imagem: "/destinos/bangkok-chinatown.jpg",
    },
    {
      id: "wat-arun",
      nome: "Wat Arun",
      categoria: "Histórico",
      descricao:
        "O templo do amanhecer, às margens do rio Chao Phraya, com vista da torre central.",
    },
  ],
  experiencias: [
    {
      id: "street-food-em-yaowarat",
      titulo: "Street food em Yaowarat",
      descricao:
        "Noite de degustação pela avenida mais famosa de comida de rua, com guia que ajuda a escolher e pedir.",
      categoria: "gastronomia",
      perfis: ["sozinho", "casal", "familia"],
      preco: 1200,
      duracao: "3 horas",
      nivel: "Divertido",
      imagem: "/destinos/bangkok-chinatown.jpg",
    },
    {
      id: "canais-de-barco",
      titulo: "Passeio de barco pelos canais",
      descricao:
        "Barco de cauda longa pelos canais de Thonburi, com casas sobre palafitas e pequenos templos.",
      categoria: "cultura",
      perfis: ["familia", "casal"],
      preco: 800,
      duracao: "2 horas",
      nivel: "Fácil",
    },
    {
      id: "templos-ao-amanhecer",
      titulo: "Templos ao amanhecer",
      descricao:
        "Roteiro cedo pelos principais templos, para evitar o calor e as filas da manhã.",
      categoria: "cultura",
      perfis: ["sozinho", "casal", "familia"],
      preco: 1500,
      duracao: "4 horas",
      nivel: "Moderado",
    },
    {
      id: "rooftops-e-mercados-noturnos",
      titulo: "Rooftops e mercados noturnos",
      descricao:
        "Início da noite em um bar no alto de um prédio e depois um mercado noturno de comida e artesanato.",
      categoria: "noturno",
      perfis: ["casal", "sozinho"],
      preco: 900,
      duracao: "4 horas",
      nivel: "Animado",
    },
  ],
};
