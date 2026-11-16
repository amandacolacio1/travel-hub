import type { Destino } from "@/features/destinos/types/destino";

export const lisboa: Destino = {
  slug: "lisboa",
  cidade: "Lisboa",
  pais: "Portugal",
  codigoPais: "PT",
  continente: "Europa",
  tema: "Tradição & Modernidade",
  frase:
    "Onde a luz do sol dança sobre os azulejos centenários e o fado ecoa pelas ruelas de pedra.",
  resumo:
    "Cidade das sete colinas que une história, gastronomia acessível e clima ameno na maior parte do ano.",
  descricao:
    "Lisboa combina o charme de bairros históricos como Alfama e Príncipe Real com uma cena gastronômica vibrante e miradouros a cada esquina. É uma capital compacta, fácil de percorrer a pé, de bonde ou de metrô, e com ótimo custo-benefício entre as capitais europeias.",
  imagem: "/destinos/lisboa.jpg",
  nota: 9.4,
  clima: {
    minC: 14,
    maxC: 26,
    tipo: "sol",
    descricao: "Ensolarado",
    diasChuvososPct: 20,
  },
  melhorEpoca: { estacao: "Primavera", meses: [3, 4, 5] },
  moeda: { codigo: "EUR", base: 1, cotacaoBRL: 5.8 },
  custoDiarioBRL: 480,
  afinidade: {
    natureza: 7,
    cultura: 9,
    gastronomia: 9,
    familia: 8,
    romance: 9,
    economia: 7,
  },
  vibe: ["Histórico", "Relaxado"],
  pontosFortes: [
    "Ótimo custo-benefício entre as capitais europeias",
    "Cultura rica e museus de nível internacional",
  ],
  pontosDeAtencao: [
    "Ladeiras íngremes e calçadas escorregadias exigem calçados apropriados",
    "Reservas de alta temporada esgotam com meses de antecedência",
  ],
  pontosDeInteresse: [
    {
      id: "praca-do-comercio",
      nome: "Praça do Comércio",
      categoria: "Histórico",
      descricao:
        "A grande praça aberta para o Tejo, cercada por arcadas amarelas e pelo Arco da Rua Augusta.",
      imagem: "/destinos/lisboa-praca-do-comercio.jpg",
    },
    {
      id: "alfama-e-castelo",
      nome: "Alfama & Castelo",
      categoria: "Histórico",
      descricao:
        "O bairro mais antigo da cidade, com becos medievais, miradouros e o Castelo de São Jorge.",
    },
    {
      id: "belem",
      nome: "Belém: torre e pastéis",
      categoria: "Gastronomia",
      descricao:
        "Berço dos descobrimentos, com a Torre de Belém e a fila certa para os pastéis de nata.",
    },
  ],
  experiencias: [
    {
      id: "jantar-no-tejo",
      titulo: "Jantar privado no Rio Tejo",
      descricao:
        "Menu degustação de 5 pratos harmonizado com vinhos nacionais, servido ao entardecer sob a brisa do rio.",
      categoria: "gastronomia",
      perfis: ["casal"],
      preco: 240,
      duracao: "3 horas",
      nivel: "Privado",
    },
    {
      id: "passeio-em-alfama",
      titulo: "Passeio crepuscular em Alfama",
      descricao:
        "Perca-se nas ruelas do bairro mais antigo de Lisboa com um guia historiador que revela pátios escondidos e segredos medievais.",
      categoria: "cultura",
      perfis: ["casal", "sozinho"],
      preco: 45,
      duracao: "2 horas",
      nivel: "Fácil",
    },
    {
      id: "arte-urbana-e-maat",
      titulo: "Tour de arte urbana & MAAT",
      descricao:
        "Do graffiti de Alcântara à arquitetura ondulante do museu em Belém: uma imersão na Lisboa contemporânea.",
      categoria: "cultura",
      perfis: ["sozinho", "casal"],
      preco: 80,
      duracao: "4 horas",
      nivel: "Inspirador",
    },
    {
      id: "serra-de-sintra",
      titulo: "Ecossistema da Serra de Sintra",
      descricao:
        "Trilhas fora do roteiro tradicional para conhecer a fauna e a flora local com guias especializados em conservação.",
      categoria: "natureza",
      perfis: ["familia", "casal"],
      preco: 95,
      duracao: "Dia todo",
      nivel: "Moderado",
    },
    {
      id: "noite-de-fado",
      titulo: "Noite de fado em Alfama",
      descricao:
        "Jantar leve em casa de fados tradicional, com apresentações ao vivo em ambiente intimista.",
      categoria: "noturno",
      perfis: ["casal", "sozinho"],
      preco: 60,
      duracao: "2 horas",
      nivel: "Intimista",
    },
  ],
};
