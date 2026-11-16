import { create } from "zustand";

type ComparadorState = {
  /** `null` até o usuário mexer: enquanto isso, a tela usa o top 3 do ranking. */
  slugs: string[] | null;
  setSlugs: (slugs: string[]) => void;
};

/** Só guarda a escolha do usuário (estado de UI); os destinos vêm do TanStack Query. */
export const useComparadorStore = create<ComparadorState>((set) => ({
  slugs: null,
  setSlugs: (slugs) => set({ slugs }),
}));
