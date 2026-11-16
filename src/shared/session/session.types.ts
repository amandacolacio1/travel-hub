import type { PerfilViagem } from "@/features/auth/types/auth";

/**
 * Sessão completa devolvida pelo `GET /api/auth/session`: quem está logado e
 * as preferências salvas. Os destinos salvos não fazem parte dela — vivem em
 * `GET /api/viagens` (ver `useTrips`).
 */
export type Session = {
  usuario: {
    nome: string;
    email: string;
    /** `null` enquanto o usuário não enviou foto — a UI cai no placeholder. */
    fotoUrl: string | null;
    /** País e cidade de origem; vazios até o usuário preencher no perfil. */
    pais: string;
    cidade: string;
  };
  preferencias: {
    interesses: string[];
    orcamentoInicial: number;
    orcamentoFinal: number;
    dataPrevista: string;
  };
  perfilViagem: PerfilViagem;
};

export type SessionPreferencias = Session["preferencias"];
