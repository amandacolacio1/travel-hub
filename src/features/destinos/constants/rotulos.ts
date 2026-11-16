import {
  Landmark,
  Leaf,
  type LucideIcon,
  Moon,
  UtensilsCrossed,
} from "lucide-react";
import type { BadgeTone } from "@/shared/components/ui";
import type {
  ExperienciaCategoria,
  InteresseId,
  NivelCusto,
} from "../types/destino";

export const NIVEL_CUSTO: Record<NivelCusto, { label: string; tone: BadgeTone }> = {
  economico: { label: "Econômico", tone: "success" },
  moderado: { label: "Moderado", tone: "info" },
  alto: { label: "Alto", tone: "neutral" },
  "muito-alto": { label: "Muito alto", tone: "error" },
};

export const CATEGORIAS_EXPERIENCIA: {
  id: ExperienciaCategoria;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "gastronomia", label: "Gastronomia", icon: UtensilsCrossed },
  { id: "natureza", label: "Natureza", icon: Leaf },
  { id: "cultura", label: "Cultura", icon: Landmark },
  { id: "noturno", label: "Noturno", icon: Moon },
];

/** Interesse do cadastro que corresponde a cada categoria de experiência. */
export const INTERESSE_DA_CATEGORIA: Record<ExperienciaCategoria, InteresseId> = {
  gastronomia: "gastronomia",
  natureza: "natureza",
  cultura: "cultura",
  noturno: "romance",
};

/** Como cada perfil aparece em frases ("viagens em casal"). */
export const PERFIL_FRASE = {
  sozinho: "a sós",
  casal: "em casal",
  familia: "em família",
} as const;
