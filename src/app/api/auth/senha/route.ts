import { NextResponse } from "next/server";
import { alterarSenhaSchema } from "@/features/auth/schemas/senha.schema";
import {
  limparTentativas,
  registrarTentativa,
} from "@/server/auth/limite-de-tentativas";
import { gerarHashDeSenha, verificarSenha } from "@/server/auth/senha";
import { lerUsuarioIdDaSessao } from "@/server/auth/sessao";
import { buscarUsuarioPorId } from "@/server/auth/usuarios-mock";

const SEM_CACHE = { "Cache-Control": "no-store" };

function erro(message: string, status: number, extra?: HeadersInit) {
  return NextResponse.json(
    { message },
    { status, headers: { ...SEM_CACHE, ...extra } },
  );
}

/** `POST /api/auth/senha` — troca a senha do usuário logado. */
export async function POST(request: Request) {
  const usuarioId = await lerUsuarioIdDaSessao();
  const usuario = usuarioId ? buscarUsuarioPorId(usuarioId) : undefined;
  if (!usuarioId || !usuario) return erro("Sessão não encontrada", 401);

  // Limite próprio por usuário: impede adivinhar a senha atual por aqui.
  const chave = `senha:${usuarioId}`;
  const limite = registrarTentativa(chave);
  if (limite.bloqueado) {
    return erro("Muitas tentativas. Tente novamente mais tarde.", 429, {
      "Retry-After": String(limite.esperarSegundos),
    });
  }

  const corpo = await request.json().catch(() => null);
  const validacao = alterarSenhaSchema.safeParse(corpo);
  if (!validacao.success) return erro("Dados inválidos", 400);

  const { senhaAtual, novaSenha } = validacao.data;

  if (!(await verificarSenha(senhaAtual, usuario.senhaHash))) {
    return erro("A senha atual está incorreta", 403);
  }

  usuario.senhaHash = await gerarHashDeSenha(novaSenha);
  limparTentativas(chave);

  return new NextResponse(null, { status: 204, headers: SEM_CACHE });
}
