import "server-only";

import { Prisma } from "@/generated/prisma/client";

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
