import type { Destino } from "@/features/destinos/types/destino";

export const rioDeJaneiro: Destino = {
  slug: "rio-de-janeiro-rj",
  cidade: "Rio de Janeiro",
  uf: "RJ",
  estado: "Rio de Janeiro",
  regiao: "Sudeste",
  tema: "Natureza & Cultura Carioca",
  frase: "Montanha, mar e música em uma só paisagem.",
  resumo:
    "Praias, trilhas urbanas e cultura carioca, com clima quente quase o ano todo.",
  descricao:
    "O Rio mistura praia, floresta e vida urbana. Dá para amanhecer numa trilha, almoçar na orla e terminar o dia com samba na Lapa. A cidade pede atenção com segurança e deslocamentos longos, mas entrega paisagens que poucas capitais têm.",
  imagem: "/destinos/rio-de-janeiro.jpg",
  nota: 9,
  clima: {
    minC: 21,
    maxC: 31,
    tipo: "sol",
    descricao: "Quente",
    diasChuvososPct: 35,
  },
  melhorEpoca: { estacao: "Outono", meses: [4, 5, 6] },
  custoDiarioBRL: 340,
  afinidade: {
    natureza: 10,
    cultura: 8,
    gastronomia: 8,
    familia: 8,
    romance: 8,
    economia: 8,
  },
  vibe: ["Praiano", "Animado"],
  pontosFortes: [
    "Praias e trilhas dentro da cidade",
    "Boa relação custo-benefício para quem viaja do Brasil",
  ],
  pontosDeAtencao: [
    "Atenção redobrada com segurança em áreas isoladas e à noite",
    "O verão traz calor intenso e praias lotadas",
  ],
  pontosDeInteresse: [
    {
      id: "pao-de-acucar",
      nome: "Pão de Açúcar",
      categoria: "Natureza",
      descricao:
        "Bondinho até o topo para ver a baía de Guanabara, Botafogo e o Corcovado ao pôr do sol.",
    },
    {
      id: "cristo-redentor",
      nome: "Cristo Redentor",
      categoria: "Ícone",
      descricao:
        "O monumento no alto do Corcovado, com vista de 360° para a cidade, as lagoas e o mar.",
      imagem: "/destinos/rio-de-janeiro-corcovado.jpg",
    },
    {
      id: "lapa-e-santa-teresa",
      nome: "Lapa & Santa Teresa",
      categoria: "Cultura",
      descricao:
        "Arcos, escadarias coloridas, ateliês e casas de samba nos bairros boêmios da cidade.",
    },
  ],
  experiencias: [
    {
      id: "trilha-urca",
      titulo: "Trilha do Morro da Urca ao nascer do sol",
      descricao:
        "Caminhada leve até o mirante, com vista para a baía antes da chegada dos turistas.",
      categoria: "natureza",
      perfis: ["sozinho", "familia", "casal"],
      preco: 180,
      duracao: "3 horas",
      nivel: "Moderado",
    },
    {
      id: "roda-de-samba",
      titulo: "Roda de samba na Lapa",
      descricao:
        "Noite em casa de samba tradicional, com música ao vivo e petiscos cariocas.",
      categoria: "noturno",
      perfis: ["casal", "sozinho"],
      preco: 90,
      duracao: "3 horas",
      nivel: "Animado",
    },
    {
      id: "santa-teresa-a-pe",
      titulo: "Santa Teresa e Escadaria Selarón",
      descricao:
        "Passeio de bonde e a pé por ateliês, mirantes e pela escadaria mais colorida da cidade.",
      categoria: "cultura",
      perfis: ["casal", "sozinho", "familia"],
      preco: 120,
      duracao: "3 horas",
      nivel: "Fácil",
    },
    {
      id: "corcovado-de-trem",
      titulo: "Corcovado de trem",
      descricao:
        "Subida pela Floresta da Tijuca no trem do Corcovado até o Cristo Redentor.",
      categoria: "natureza",
      perfis: ["familia", "casal"],
      preco: 160,
      duracao: "4 horas",
      nivel: "Fácil",
      imagem: "/destinos/rio-de-janeiro-corcovado.jpg",
    },
    {
      id: "feijoada-e-confeitaria",
      titulo: "Feijoada e confeitaria clássica",
      descricao:
        "Almoço de feijoada em casa tradicional e café da tarde em confeitaria histórica do centro.",
      categoria: "gastronomia",
      perfis: ["familia", "casal", "sozinho"],
      preco: 140,
      duracao: "3 horas",
      nivel: "Clássico",
    },
  ],
};
