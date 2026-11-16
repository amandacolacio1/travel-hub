import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { Session } from "@/shared/session/session.types";
import { prisma } from "@/server/db/prisma";
import { SESSION_INCLUDE, toPublicSession } from "./session-mapper";

export const COOKIE_SESSAO = "travel-hub-sessao";

/** Expiração curta com renovação deslizante (§3.1). */
const DURACAO_SEGUNDOS = 30 * 60;
const DURACAO_MS = DURACAO_SEGUNDOS * 1000;

/**
 * Só renova quando falta menos da metade do tempo: evita gravar no banco a
 * cada requisição e ainda mantém logado quem está usando o app.
 */
const RENOVAR_QUANDO_RESTAR_MS = DURACAO_MS / 2;

/**
 * O cookie leva um token aleatório; o banco guarda só o SHA-256 dele. Quem
 * ler a tabela `sessoes` não consegue se passar por ninguém.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function definirCookie(token: string) {
  const armazenamento = await cookies();
  armazenamento.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });
}

async function lerToken(): Promise<string | null> {
  const armazenamento = await cookies();
  return armazenamento.get(COOKIE_SESSAO)?.value ?? null;
}

export async function criarSessao(usuarioId: string): Promise<Session> {
  const token = randomBytes(32).toString("base64url");

  await prisma.$transaction([
    // Faxina barata: aproveita o login para apagar sessões vencidas do usuário.
    prisma.sessao.deleteMany({
      where: { usuarioId, expiraEm: { lt: new Date() } },
    }),
    prisma.sessao.create({
      data: {
        tokenHash: hashToken(token),
        usuarioId,
        expiraEm: new Date(Date.now() + DURACAO_MS),
      },
    }),
  ]);

  await definirCookie(token);

  // Fora da transação: o `include` roda consultas em paralelo (ver update-profile.ts).
  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    include: SESSION_INCLUDE,
  });

  return toPublicSession(usuario);
}

async function buscarSessaoValida(token: string) {
  const sessao = await prisma.sessao.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, usuarioId: true, expiraEm: true },
  });
  if (!sessao) return null;

  if (sessao.expiraEm <= new Date()) {
    await prisma.sessao.delete({ where: { id: sessao.id } }).catch(() => {});
    return null;
  }

  return sessao;
}

/**
 * Sessão pública do usuário logado, ou `null`. Renova a expiração (no banco
 * e no cookie) quando ela está perto de vencer.
 */
export async function lerSessao(): Promise<Session | null> {
  const token = await lerToken();
  if (!token) return null;

  const sessao = await buscarSessaoValida(token);
  if (!sessao) return null;

  if (sessao.expiraEm.getTime() - Date.now() < RENOVAR_QUANDO_RESTAR_MS) {
    await prisma.sessao.update({
      where: { id: sessao.id },
      data: { expiraEm: new Date(Date.now() + DURACAO_MS) },
    });
    // Sem reenviar o cookie, ele venceria no navegador mesmo com a sessão
    // renovada no banco.
    await definirCookie(token);
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: sessao.usuarioId },
    include: SESSION_INCLUDE,
  });

  return usuario ? toPublicSession(usuario) : null;
}

/** Id do usuário dono da sessão atual; só para uso interno do servidor. */
export async function lerUsuarioIdDaSessao(): Promise<string | null> {
  const token = await lerToken();
  if (!token) return null;

  const sessao = await buscarSessaoValida(token);
  return sessao?.usuarioId ?? null;
}

export async function encerrarSessao(): Promise<void> {
  const token = await lerToken();

  if (token) {
    await prisma.sessao.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  const armazenamento = await cookies();
  armazenamento.delete(COOKIE_SESSAO);
}

/**
 * Derruba todas as outras sessões do usuário, mantendo a atual. Usado na troca
 * de senha: quem tinha roubado uma sessão perde o acesso junto.
 */
export async function encerrarOutrasSessoes(usuarioId: string): Promise<void> {
  const token = await lerToken();

  await prisma.sessao.deleteMany({
    where: {
      usuarioId,
      ...(token && { tokenHash: { not: hashToken(token) } }),
    },
  });
}
