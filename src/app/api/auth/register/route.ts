import { NextResponse, after } from "next/server";
import { registerSchema } from "@/features/auth/schemas/register.schema";
import {
  identificarOrigem,
  registrarTentativa,
} from "@/server/auth/limite-de-tentativas";
import { criarSessao } from "@/server/auth/sessao";
import { ensureProfilesForUser } from "@/server/destinations/destination-catalog";
import { HttpError, isUniqueViolation } from "@/server/http/http-error";
import { registerUser } from "@/server/users/register-user";

const SEM_CACHE = { "Cache-Control": "no-store" };

function erro(message: string, status: number, extra?: HeadersInit) {
  return NextResponse.json(
    { message },
    { status, headers: { ...SEM_CACHE, ...extra } },
  );
}

/**
 * `POST /api/auth/register` — cria a conta com as preferências do wizard e já
 * abre a sessão, como o login.
 */
export async function POST(request: Request) {
  // Limite por origem: freia criação de contas em massa e a sondagem de
  // e-mails cadastrados pela resposta 409.
  const limite = registrarTentativa(`registro:${identificarOrigem(request)}`);
  if (limite.bloqueado) {
    return erro("Muitas tentativas. Tente novamente mais tarde.", 429, {
      "Retry-After": String(limite.esperarSegundos),
    });
  }

  const corpo = await request.json().catch(() => null);
  const validacao = registerSchema.safeParse(corpo);
  if (!validacao.success) {
    const primeira = validacao.error.issues[0]?.message;
    return erro(primeira ?? "Dados inválidos", 400);
  }

  try {
    const usuarioId = await registerUser(validacao.data);
    // Fichas das cidades escolhidas no cadastro: geradas depois da resposta.
    after(() => ensureProfilesForUser(usuarioId));
    const sessao = await criarSessao(usuarioId);
    return NextResponse.json(sessao, { status: 201, headers: SEM_CACHE });
  } catch (falha) {
    if (isUniqueViolation(falha)) {
      return erro("Este e-mail já está cadastrado", 409);
    }
    if (falha instanceof HttpError) return erro(falha.message, falha.status);
    throw falha;
  }
}
