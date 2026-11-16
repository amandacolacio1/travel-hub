import { NextResponse } from "next/server";
import { atualizarSessaoSchema } from "@/features/auth/schemas/sessao.schema";
import { atualizarSessao, lerSessao } from "@/server/auth/sessao";

const SEM_CACHE = { "Cache-Control": "no-store" };

export async function GET() {
  const sessao = await lerSessao();

  if (!sessao) {
    return NextResponse.json(
      { message: "Sessão não encontrada" },
      { status: 401, headers: SEM_CACHE },
    );
  }

  return NextResponse.json(sessao, { headers: SEM_CACHE });
}

export async function PATCH(request: Request) {
  const corpo = await request.json().catch(() => null);
  const validacao = atualizarSessaoSchema.safeParse(corpo);

  if (!validacao.success) {
    return NextResponse.json(
      { message: "Dados inválidos" },
      { status: 400, headers: SEM_CACHE },
    );
  }

  const sessao = await atualizarSessao(validacao.data);

  if (!sessao) {
    return NextResponse.json(
      { message: "Sessão não encontrada" },
      { status: 401, headers: SEM_CACHE },
    );
  }

  return NextResponse.json(sessao, { headers: SEM_CACHE });
}
