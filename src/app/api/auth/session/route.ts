import { NextResponse } from "next/server";
import { atualizarSessaoSchema } from "@/features/auth/schemas/sessao.schema";
import { lerSessao, lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { HttpError, isUniqueViolation } from "@/server/http/http-error";
import { updateProfile } from "@/server/users/update-profile";

const SEM_CACHE = { "Cache-Control": "no-store" };

function erro(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: SEM_CACHE });
}

export async function GET() {
  const sessao = await lerSessao();

  if (!sessao) return erro("Sessão não encontrada", 401);

  return NextResponse.json(sessao, { headers: SEM_CACHE });
}

export async function PATCH(request: Request) {
  const usuarioId = await lerUsuarioIdDaSessao();
  if (!usuarioId) return erro("Sessão não encontrada", 401);

  const corpo = await request.json().catch(() => null);
  const validacao = atualizarSessaoSchema.safeParse(corpo);
  if (!validacao.success) return erro("Dados inválidos", 400);

  try {
    const sessao = await updateProfile(usuarioId, validacao.data);
    return NextResponse.json(sessao, { headers: SEM_CACHE });
  } catch (falha) {
    if (isUniqueViolation(falha)) {
      return erro("Este e-mail já está em uso por outra conta", 409);
    }
    if (falha instanceof HttpError) return erro(falha.message, falha.status);
    throw falha;
  }
}
