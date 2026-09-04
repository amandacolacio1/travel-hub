export type InteresseOption = {
  id: string;
  titulo: string;
  descricao: string;
  icon: "natureza" | "cultura" | "gastronomia" | "familia" | "romance" | "economia";
};

export const INTERESSES: InteresseOption[] = [
  {
    id: "natureza",
    titulo: "Natureza",
    descricao: "Trilhas, praias e paisagens",
    icon: "natureza",
  },
  {
    id: "cultura",
    titulo: "Cultura",
    descricao: "Museus, história e arte",
    icon: "cultura",
  },
  {
    id: "gastronomia",
    titulo: "Gastronomia",
    descricao: "Restaurantes e sabores locais",
    icon: "gastronomia",
  },
  {
    id: "familia",
    titulo: "Família",
    descricao: "Atividades para todas as idades",
    icon: "familia",
  },
  {
    id: "romance",
    titulo: "Romance",
    descricao: "Experiências a dois",
    icon: "romance",
  },
  {
    id: "economia",
    titulo: "Economia",
    descricao: "Custo-benefício e praticidade",
    icon: "economia",
  },
];
