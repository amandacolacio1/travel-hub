import type { AuthPayload, PerfilViagem } from "@/features/auth/types/auth";
import type { Session, SessionPreferencias } from "./session.types";

/**
 * Cliente das rotas de autenticação. A sessão vive num cookie httpOnly que o
 * JavaScript não lê — por isso toda leitura passa por `GET /api/auth/session`.
 */

export class UnauthorizedError extends Error {
  constructor() {
    super("Sessão não encontrada");
    this.name = "UnauthorizedError";
  }
}

export class CredenciaisInvalidasError extends Error {
  constructor(message = "E-mail ou senha inválidos") {
    super(message);
    this.name = "CredenciaisInvalidasError";
  }
}

async function lerMensagemDeErro(resposta: Response, padrao: string) {
  const corpo = await resposta.json().catch(() => null);
  return typeof corpo?.message === "string" ? corpo.message : padrao;
}

export async function fetchSession(): Promise<Session> {
  const resposta = await fetch("/api/auth/session", {
    credentials: "same-origin",
    cache: "no-store",
  });

  if (resposta.status === 401) throw new UnauthorizedError();
  if (!resposta.ok) throw new Error("Não foi possível carregar a sessão");

  return resposta.json();
}

export async function signIn(email: string, senha: string): Promise<Session> {
  const resposta = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ email, senha }),
  });

  if (!resposta.ok) {
    throw new CredenciaisInvalidasError(
      await lerMensagemDeErro(resposta, "E-mail ou senha inválidos"),
    );
  }

  return resposta.json();
}

/** Cria a conta e já devolve a sessão aberta (o servidor seta o cookie). */
export async function register(payload: AuthPayload): Promise<Session> {
  const resposta = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });

  if (!resposta.ok) {
    throw new Error(
      await lerMensagemDeErro(resposta, "Não foi possível criar sua conta"),
    );
  }

  return resposta.json();
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}

async function atualizarSessao(
  payload: Record<string, unknown>,
): Promise<Session> {
  const resposta = await fetch("/api/auth/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });

  if (resposta.status === 401) throw new UnauthorizedError();
  if (!resposta.ok) {
    // O servidor explica recusas de regra (e-mail em uso, limite de destinos…).
    throw new Error(
      await lerMensagemDeErro(resposta, "Não foi possível salvar as alterações"),
    );
  }

  return resposta.json();
}

export async function updatePerfilViagem(
  perfilViagem: PerfilViagem,
): Promise<Session> {
  return atualizarSessao({ perfilViagem });
}

export async function updatePreferencias(
  patch: Partial<SessionPreferencias>,
): Promise<Session> {
  return atualizarSessao({ preferencias: patch });
}

export type PerfilPatch = {
  usuario?: Partial<Session["usuario"]>;
  preferencias?: Partial<SessionPreferencias>;
};

/** Salva dados da conta e preferências em um único PATCH. */
export async function updatePerfil(patch: PerfilPatch): Promise<Session> {
  return atualizarSessao(patch);
}
