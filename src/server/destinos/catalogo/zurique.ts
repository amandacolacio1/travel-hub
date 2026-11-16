import type { Destino } from "@/features/destinos/types/destino";

export const zurique: Destino = {
  slug: "zurique",
  cidade: "Zurique",
  pais: "Suíça",
  codigoPais: "CH",
  continente: "Europa",
  tema: "Elegância Alpina",
  frase:
    "Um lago cristalino, ruas de pedra e os Alpes à distância de um passeio de trem.",
  resumo:
    "Cidade segura e organizada para combinar centro histórico com montanhas, com o custo mais alto do comparativo.",
  descricao:
    "Zurique tem centro medieval, lago para banho no verão e trens que levam aos Alpes em pouco tempo. É organizada, segura e sofisticada, e cobra por isso: está entre as cidades mais caras do mundo para hospedagem e refeições.",
  imagem: "/destinos/zurique.jpg",
  nota: 9.1,
  clima: {
    minC: 2,
    maxC: 23,
    tipo: "frio",
    descricao: "Fresco",
    diasChuvososPct: 40,
  },
  melhorEpoca: { estacao: "Verão", meses: [6, 7, 8] },
  moeda: { codigo: "CHF", base: 1, cotacaoBRL: 6.2 },
  custoDiarioBRL: 1400,
  afinidade: {
    natureza: 9,
    cultura: 7,
    gastronomia: 7,
    familia: 9,
    romance: 8,
    economia: 2,
  },
  vibe: ["Eficiente", "Sofisticado"],
  pontosFortes: [
    "Segurança e organização acima da média",
    "Lago, trilhas e Alpes acessíveis de trem",
  ],
  pontosDeAtencao: [
    "Custo diário entre os mais altos da Europa",
    "Comércio fecha cedo e costuma ficar fechado aos domingos",
  ],
  pontosDeInteresse: [
    {
      id: "altstadt",
      nome: "Cidade Antiga (Altstadt)",
      categoria: "Histórico",
      descricao:
        "Ruelas de pedra, igrejas e fachadas medievais dos dois lados do rio Limmat.",
    },
    {
      id: "lago-de-zurique",
      nome: "Lago de Zurique",
      categoria: "Natureza",
      descricao:
        "Orla com piers, áreas de banho no verão e vistas para os Alpes em dias claros.",
    },
    {
      id: "uetliberg",
      nome: "Uetliberg",
      categoria: "Mirante",
      descricao:
        "A montanha da cidade, a poucos minutos de trem, com vista panorâmica de Zurique e do lago.",
    },
  ],
  experiencias: [
    {
      id: "barco-no-lago",
      titulo: "Passeio de barco pelo Lago de Zurique",
      descricao:
        "Travessia tranquila com vista para a cidade, vilarejos da margem e, em dias claros, para os Alpes.",
      categoria: "natureza",
      perfis: ["familia", "casal"],
      preco: 40,
      duracao: "2 horas",
      nivel: "Fácil",
    },
    {
      id: "fondue-na-altstadt",
      titulo: "Fondue em taverna da Altstadt",
      descricao:
        "Fondue de queijo em uma taverna tradicional do centro histórico, com vinho branco suíço.",
      categoria: "gastronomia",
      perfis: ["casal", "familia", "sozinho"],
      preco: 70,
      duracao: "2 horas",
      nivel: "Clássico",
    },
    {
      id: "excursao-aos-alpes",
      titulo: "Excursão de dia aos Alpes",
      descricao:
        "Bate-volta de trem ao vale de Lauterbrunnen, com cachoeiras, vilarejos e trilhas leves.",
      categoria: "natureza",
      perfis: ["familia", "casal"],
      preco: 180,
      duracao: "Dia todo",
      nivel: "Moderado",
      imagem: "/destinos/zurique-lauterbrunnen.jpg",
    },
    {
      id: "kunsthaus",
      titulo: "Tour de museus e Kunsthaus",
      descricao:
        "Percurso pelo principal museu de arte da cidade e por galerias do bairro de Zurich West.",
      categoria: "cultura",
      perfis: ["sozinho", "casal"],
      preco: 35,
      duracao: "3 horas",
      nivel: "Inspirador",
    },
    {
      id: "zurich-west-a-noite",
      titulo: "Bares de Zurich West",
      descricao:
        "Noite entre antigos galpões industriais transformados em bares, restaurantes e casas de música.",
      categoria: "noturno",
      perfis: ["sozinho", "casal"],
      preco: 50,
      duracao: "3 horas",
      nivel: "Animado",
    },
  ],
};
