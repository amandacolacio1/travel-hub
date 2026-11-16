import type { Destino } from "@/features/destinos/types/destino";

export const toquio: Destino = {
  slug: "toquio",
  cidade: "Tóquio",
  pais: "Japão",
  codigoPais: "JP",
  continente: "Ásia",
  tema: "Fusão Futurista",
  frase:
    "Neon, templos e silêncio: uma metrópole onde o futuro convive com séculos de tradição.",
  resumo:
    "Infraestrutura impecável, segurança e gastronomia de altíssimo nível, com bairros para todos os gostos.",
  descricao:
    "Tóquio reúne bairros que parecem países distintos, do neon de Shinjuku aos templos de Asakusa. Transporte pontual, ruas seguras e uma cena gastronômica que vai de balcões de ramen a restaurantes premiados fazem dela uma das metrópoles mais fáceis de viajar, mesmo para quem não fala japonês.",
  imagem: "/destinos/toquio.jpg",
  nota: 9.6,
  clima: {
    minC: 12,
    maxC: 26,
    tipo: "parcial",
    descricao: "Ameno",
    diasChuvososPct: 35,
  },
  melhorEpoca: { estacao: "Primavera", meses: [3, 4, 5] },
  moeda: { codigo: "JPY", base: 100, cotacaoBRL: 3.8 },
  custoDiarioBRL: 700,
  afinidade: {
    natureza: 6,
    cultura: 10,
    gastronomia: 10,
    familia: 8,
    romance: 7,
    economia: 5,
  },
  vibe: ["Neo-futurista", "Ordem"],
  pontosFortes: [
    "Transporte público pontual e abrangente",
    "Ruas seguras, mesmo à noite",
  ],
  pontosDeAtencao: [
    "Barreira do idioma fora dos pontos turísticos",
    "A temporada das cerejeiras lota hospedagens e atrações",
  ],
  pontosDeInteresse: [
    {
      id: "senso-ji",
      nome: "Senso-ji e Asakusa",
      categoria: "Histórico",
      descricao:
        "O templo mais antigo da cidade, com a avenida de lojinhas tradicionais Nakamise.",
    },
    {
      id: "shibuya",
      nome: "Cruzamento de Shibuya",
      categoria: "Contemporâneo",
      descricao:
        "O cruzamento mais movimentado do mundo, melhor visto de cima, nos mirantes ao redor.",
    },
    {
      id: "tsukiji",
      nome: "Mercado externo de Tsukiji",
      categoria: "Gastronomia",
      descricao:
        "Barracas de sushi, tamagoyaki e frutos do mar para um café da manhã à japonesa.",
    },
  ],
  experiencias: [
    {
      id: "tour-tsukiji",
      titulo: "Tour gastronômico em Tsukiji",
      descricao:
        "Prove sushi, tamagoyaki e petiscos de rua com um guia local que explica ingredientes e etiqueta à mesa.",
      categoria: "gastronomia",
      perfis: ["sozinho", "casal", "familia"],
      preco: 12000,
      duracao: "3 horas",
      nivel: "Fácil",
    },
    {
      id: "cerimonia-do-cha",
      titulo: "Cerimônia do chá em casa tradicional",
      descricao:
        "Aprenda os gestos e o significado do chá matcha em uma casa de chá de Asakusa.",
      categoria: "cultura",
      perfis: ["casal", "sozinho"],
      preco: 8500,
      duracao: "1h30",
      nivel: "Tranquilo",
    },
    {
      id: "izakaya-em-shinjuku",
      titulo: "Izakayas de Shinjuku à noite",
      descricao:
        "Roteiro por pequenos bares de bairro, com petiscos e bebidas típicas, guiado por um morador.",
      categoria: "noturno",
      perfis: ["sozinho", "casal"],
      preco: 9500,
      duracao: "3 horas",
      nivel: "Animado",
    },
    {
      id: "hakone-e-monte-fuji",
      titulo: "Hakone e vista do Monte Fuji",
      descricao:
        "Bate-volta de trem com lago, teleférico e, com sorte, a vista do Monte Fuji.",
      categoria: "natureza",
      perfis: ["familia", "casal"],
      preco: 18000,
      duracao: "Dia todo",
      nivel: "Moderado",
    },
  ],
};
