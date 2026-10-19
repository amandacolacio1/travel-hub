import type { PerfilViagem } from "@/features/auth/types/auth";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import type { Session, SessionPreferencias } from "./session.types";

const SESSION_KEY = "travel-hub-session";
const LATENCIA_MS = 350;

/** Erro de sessão ausente/expirada — equivalente a um `401` do backend. */
export class UnauthorizedError extends Error {
  constructor() {
    super("Sessão não encontrada");
    this.name = "UnauthorizedError";
  }
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lerSessaoArmazenada(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const bruto = window.localStorage.getItem(SESSION_KEY);
    return bruto ? (JSON.parse(bruto) as Session) : null;
  } catch {
    // localStorage indisponível (modo privado) ou JSON corrompido.
    return null;
  }
}

function gravarSessao(session: Session | null) {
  if (typeof window === "undefined") return;

  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Sem persistência a sessão vira "só esta aba" — não é motivo para quebrar.
  }
}

/** Preferências iniciais de quem acabou de entrar pelo mock de login. */
function preferenciasPadrao(): SessionPreferencias {
  return {
    interesses: ["natureza", "cultura"],
    orcamentoInicial: 5000,
    orcamentoFinal: 12000,
    destinos: [{ pais: "Brasil", cidade: "Florianópolis" }],
    dataPrevista: "",
  };
}

/** `GET /api/auth/session` — lança `UnauthorizedError` se não houver sessão. */
export async function fetchSession(): Promise<Session> {
  await esperar(LATENCIA_MS);

  const session = lerSessaoArmazenada();
  if (!session) throw new UnauthorizedError();

  return session;
}

/** `POST /api/auth/login` — valida contra os usuários mockados. */
export async function signIn(email: string, senha: string): Promise<Session> {
  await esperar(LATENCIA_MS);

  const encontrado = MOCK_USERS.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.senha === senha,
  );

  if (!encontrado) {
    throw new Error("E-mail ou senha inválidos");
  }

  const session: Session = {
    usuario: { nome: encontrado.nome, email: encontrado.email, fotoUrl: null },
    preferencias: preferenciasPadrao(),
    perfilViagem: "sozinho",
  };

  gravarSessao(session);
  return session;
}

/** `POST /api/auth/logout`. */
export async function signOut(): Promise<void> {
  await esperar(120);
  gravarSessao(null);
}

/** `PATCH /api/auth/session` — troca o perfil de viagem. */
export async function updatePerfilViagem(
  perfilViagem: PerfilViagem,
): Promise<Session> {
  await esperar(LATENCIA_MS);

  const session = lerSessaoArmazenada();
  if (!session) throw new UnauthorizedError();

  const atualizada: Session = { ...session, perfilViagem };
  gravarSessao(atualizada);
  return atualizada;
}

/** `PATCH /api/auth/session` — atualiza parte das preferências. */
export async function updatePreferencias(
  patch: Partial<SessionPreferencias>,
): Promise<Session> {
  await esperar(LATENCIA_MS);

  const session = lerSessaoArmazenada();
  if (!session) throw new UnauthorizedError();

  const atualizada: Session = {
    ...session,
    preferencias: { ...session.preferencias, ...patch },
  };
  gravarSessao(atualizada);
  return atualizada;
}
