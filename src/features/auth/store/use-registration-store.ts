import { create } from "zustand";
import type { AuthStep, ContaDados, PerfilViagem } from "../types/auth";

export type PreferencesFormData = {
  interesses: string[];
  pais: string;
  cidade: string;
  orcamentoInicial: number;
  orcamentoFinal: number;
};

type RegistrationState = {
  step: AuthStep;
  maxStepReached: AuthStep;
  account: ContaDados;
  preferences: PreferencesFormData;
  travelProfile: PerfilViagem;
  setStep: (step: AuthStep) => void;
  setAccount: (data: ContaDados) => void;
  setPreferences: (data: PreferencesFormData) => void;
  setTravelProfile: (perfil: PerfilViagem) => void;
  reset: () => void;
};

const initialState = {
  step: 1 as AuthStep,
  maxStepReached: 1 as AuthStep,
  account: { nome: "", email: "", senha: "" },
  preferences: {
    interesses: ["natureza"],
    pais: "Brasil",
    cidade: "",
    orcamentoInicial: 5000,
    orcamentoFinal: 12000,
  },
  travelProfile: "sozinho" as PerfilViagem,
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  setStep: (step) =>
    set((state) => ({
      step,
      maxStepReached:
        step > state.maxStepReached ? step : state.maxStepReached,
    })),
  setAccount: (account) => set({ account }),
  setPreferences: (preferences) => set({ preferences }),
  setTravelProfile: (travelProfile) => set({ travelProfile }),
  reset: () => set(initialState),
}));
