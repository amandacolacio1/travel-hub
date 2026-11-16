import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { PerfilViagem } from "@/features/auth/types/auth";
import type { Session, SessionPreferencias } from "@/shared/session/session.types";
import type { UsuarioArmazenado } from "./usuarios-mock";

export const COOKIE_SESSAO = "travel-hub-sessao";

/** Expiração curta com renovação deslizante a cada requisição (§3.1). */
const DURACAO_SEGUNDOS = 30 * 60;

type RegistroDeSessao = {
  usuarioId: string;
  nome: string;
  email: string;
  fotoUrl: string | null;
  pais: string;
  cidade: string;
  preferencias: SessionPreferencias;
  perfilViagem: PerfilViagem;
  expiraEm: number;
};

/**
 * Sessões vivem na memória do servidor — some a cada restart e não funciona
 * com múltiplas instâncias. Suficiente para o mock; em produção isso vira
 * Redis ou tabela de sessões.
 */
const sessoes = new Map<string, RegistroDeSessao>();

function preferenciasPadrao(): SessionPreferencias {
  return {
    interesses: ["natureza", "cultura"],
    orcamentoInicial: 5000,
    orcamentoFinal: 12000,
    destinos: [{ pais: "Brasil", cidade: "Florianópolis" }],
    dataPrevista: "",
  };
}

function paraSessaoPublica(registro: RegistroDeSessao): Session {
  return {
    usuario: {
      nome: registro.nome,
      email: registro.email,
      fotoUrl: registro.fotoUrl,
      pais: registro.pais,
      cidade: registro.cidade,
    },
    preferencias: registro.preferencias,
    perfilViagem: registro.perfilViagem,
  };
}

export async function criarSessao(
  usuario: UsuarioArmazenado,
): Promise<Session> {
  const id = randomUUID();

  const registro: RegistroDeSessao = {
    usuarioId: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    fotoUrl: null,
    pais: "",
    cidade: "",
    preferencias: preferenciasPadrao(),
    perfilViagem: "sozinho",
    expiraEm: Date.now() + DURACAO_SEGUNDOS * 1000,
  };

  sessoes.set(id, registro);

  const armazenamento = await cookies();
  armazenamento.set(COOKIE_SESSAO, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });

  return paraSessaoPublica(registro);
}

async function lerRegistro(): Promise<{
  id: string;
  registro: RegistroDeSessao;
} | null> {
  const armazenamento = await cookies();
  const id = armazenamento.get(COOKIE_SESSAO)?.value;
  if (!id) return null;

  const registro = sessoes.get(id);
  if (!registro) return null;

  if (registro.expiraEm <= Date.now()) {
    sessoes.delete(id);
    return null;
  }

  return { id, registro };
}

export async function lerSessao(): Promise<Session | null> {
  const atual = await lerRegistro();
  if (!atual) return null;

  atual.registro.expiraEm = Date.now() + DURACAO_SEGUNDOS * 1000;

  return paraSessaoPublica(atual.registro);
}

export async function atualizarSessao(
  patch: Partial<Pick<RegistroDeSessao, "perfilViagem">> & {
    preferencias?: Partial<SessionPreferencias>;
    usuario?: Partial<Session["usuario"]>;
  },
): Promise<Session | null> {
  const atual = await lerRegistro();
  if (!atual) return null;

  const { registro } = atual;

  if (patch.perfilViagem) {
    registro.perfilViagem = patch.perfilViagem;
  }

  if (patch.preferencias) {
    registro.preferencias = { ...registro.preferencias, ...patch.preferencias };
  }

  if (patch.usuario) {
    Object.assign(registro, patch.usuario);
  }

  registro.expiraEm = Date.now() + DURACAO_SEGUNDOS * 1000;

  return paraSessaoPublica(registro);
}

/** Id do usuário dono da sessão atual; só para uso interno do servidor. */
export async function lerUsuarioIdDaSessao(): Promise<string | null> {
  const atual = await lerRegistro();
  return atual?.registro.usuarioId ?? null;
}

export async function encerrarSessao(): Promise<void> {
  const armazenamento = await cookies();
  const id = armazenamento.get(COOKIE_SESSAO)?.value;

  if (id) sessoes.delete(id);

  armazenamento.delete(COOKIE_SESSAO);
}
