import "server-only";

import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const NO_STORE = { "Cache-Control": "no-store" };

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: NO_STORE });
}

/**
 * Erro de regra de negócio que já sabe seu status HTTP. Os serviços lançam,
 * as rotas convertem em resposta — assim a regra não depende de `NextResponse`.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

/** Violação de `@unique` (ex.: e-mail já cadastrado). */
export function isUniqueViolation(erro: unknown): boolean {
  return (
    erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002"
  );
}

/**
 * Converte falhas conhecidas em resposta; o resto sobe como 500.
 *
 * @param conflito mensagem para violação de `@unique` (409).
 */
export function errorResponse(falha: unknown, conflito: string) {
  if (isUniqueViolation(falha)) return jsonError(conflito, 409);
  if (falha instanceof HttpError) return jsonError(falha.message, falha.status);
  throw falha;
}
