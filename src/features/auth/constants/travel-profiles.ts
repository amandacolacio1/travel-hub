import type { PerfilViagem } from "../types/auth";

export type ProfileOption = {
  id: PerfilViagem;
  titulo: string;
  descricao: string;
  icon: "sozinho" | "casal" | "familia";
};

export const TRAVEL_PROFILES: ProfileOption[] = [
  {
    id: "sozinho",
    titulo: "Sozinho",
    descricao: "Foco em mobilidade, economia e experiências locais.",
    icon: "sozinho",
  },
  {
    id: "casal",
    titulo: "Casal",
    descricao: "Foco em gastronomia, romance e conforto.",
    icon: "casal",
  },
  {
    id: "familia",
    titulo: "Família",
    descricao: "Foco em segurança, parques e atrações infantis.",
    icon: "familia",
  },
];
