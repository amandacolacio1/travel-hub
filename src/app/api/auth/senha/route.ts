import { NextResponse } from "next/server";
import { alterarSenhaSchema } from "@/features/auth/schemas/senha.schema";
import {
  limparTentativas,
  registrarTentativa,
} from "@/server/auth/limite-de-tentativas";
import { gerarHashDeSenha, verificarSenha } from "@/server/auth/senha";
import {
  encerrarOutrasSessoes,
  lerUsuarioIdDaSessao,
} from "@/server/auth/sessao";
import {
  findUserById,
  updatePasswordHash,
} from "@/server/users/user-repository";

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
  const usuario = usuarioId ? await findUserById(usuarioId) : null;
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

  await updatePasswordHash(usuarioId, await gerarHashDeSenha(novaSenha));
  // Sessões abertas em outros lugares caem: quem roubou uma perde o acesso.
  await encerrarOutrasSessoes(usuarioId);
  limparTentativas(chave);

  return new NextResponse(null, { status: 204, headers: SEM_CACHE });
}
