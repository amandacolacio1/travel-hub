import type {
  DestinoDesejado,
  PerfilViagem,
} from "@/features/auth/types/auth";

/**
 * Representa a sessão completa devolvida pelo backend: quem está logado e as
 * preferências salvas. É o formato que o `GET /api/auth/session` vai devolver
 * quando a fase de mock terminar — por isso nada aqui é opcional por
 * conveniência do mock.
 */
export type Session = {
  usuario: {
    nome: string;
    email: string;
    /** `null` enquanto o usuário não enviou foto — a UI cai no placeholder. */
    fotoUrl: string | null;
  };
  preferencias: {
    interesses: string[];
    orcamentoInicial: number;
    orcamentoFinal: number;
    destinos: DestinoDesejado[];
    dataPrevista: string;
  };
  perfilViagem: PerfilViagem;
};

export type SessionPreferencias = Session["preferencias"];
