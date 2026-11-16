import type { Destino } from "@/features/destinos/types/destino";

export const cidadeDoMexico: Destino = {
  slug: "cidade-do-mexico",
  cidade: "Cidade do México",
  pais: "México",
  codigoPais: "MX",
  continente: "América do Norte",
  tema: "Cor & Sabor",
  frase: "Mercados, murais e mesas que contam milhares de anos de história.",
  resumo:
    "Gastronomia de classe mundial e museus a preço acessível, em uma altitude que pede adaptação.",
  descricao:
    "A capital mexicana concentra museus, murais, mercados e uma das cenas gastronômicas mais celebradas do mundo. Fica a mais de 2.200 metros de altitude, com chuvas de verão no fim da tarde, e oferece ótimo custo-benefício.",
  imagem: "/destinos/cidade-do-mexico.jpg",
  nota: 8.9,
  clima: {
    minC: 11,
    maxC: 25,
    tipo: "parcial",
    descricao: "Seco e ameno",
    diasChuvososPct: 30,
  },
  melhorEpoca: { estacao: "Inverno seco", meses: [11, 12, 1, 2, 3] },
  moeda: { codigo: "MXN", base: 1, cotacaoBRL: 0.3 },
  custoDiarioBRL: 330,
  afinidade: {
    natureza: 5,
    cultura: 10,
    gastronomia: 10,
    familia: 7,
    romance: 7,
    economia: 9,
  },
  vibe: ["Colorido", "Vibrante"],
  pontosFortes: [
    "Gastronomia de nível mundial a preços acessíveis",
    "Museus e centros históricos de ponta",
  ],
  pontosDeAtencao: [
    "A altitude pode causar cansaço nos primeiros dias",
    "Prefira transporte por aplicativo à noite e evite água de torneira",
  ],
  pontosDeInteresse: [
    {
      id: "zocalo",
      nome: "Zócalo e Catedral",
      categoria: "Histórico",
      descricao:
        "A praça central do país, com a Catedral Metropolitana e o Palácio Nacional ao redor.",
    },
    {
      id: "coyoacan",
      nome: "Coyoacán e Casa Azul",
      categoria: "Cultura",
      descricao:
        "Bairro de ruas calçadas e praças, com a casa-museu de Frida Kahlo.",
    },
    {
      id: "mercado-de-san-juan",
      nome: "Mercados gastronômicos",
      categoria: "Gastronomia",
      descricao:
        "Bancas de ingredientes, tacos e doces tradicionais nos mercados do centro.",
    },
  ],
  experiencias: [
    {
      id: "tacos-e-mercados",
      titulo: "Tour de tacos e mercados",
      descricao:
        "Quatro horas provando tacos, tamales e bebidas típicas com um guia que conhece cada banca.",
      categoria: "gastronomia",
      perfis: ["sozinho", "casal", "familia"],
      preco: 600,
      duracao: "4 horas",
      nivel: "Divertido",
    },
    {
      id: "xochimilco",
      titulo: "Xochimilco de trajinera",
      descricao:
        "Passeio pelos canais em barcos coloridos, com música ao vivo e comida a bordo.",
      categoria: "cultura",
      perfis: ["familia", "casal"],
      preco: 900,
      duracao: "3 horas",
      nivel: "Fácil",
    },
    {
      id: "teotihuacan",
      titulo: "Pirâmides de Teotihuacán ao amanhecer",
      descricao:
        "Visita com guia ao sítio arqueológico antes do calor e da chegada dos grupos grandes.",
      categoria: "cultura",
      perfis: ["familia", "casal"],
      preco: 1200,
      duracao: "Dia todo",
      nivel: "Moderado",
    },
    {
      id: "lucha-libre-e-mezcal",
      titulo: "Lucha libre e mezcalerías",
      descricao:
        "Noite de luta livre mexicana seguida de degustação de mezcais em um bar tradicional.",
      categoria: "noturno",
      perfis: ["sozinho", "casal"],
      preco: 700,
      duracao: "4 horas",
      nivel: "Animado",
    },
  ],
};
