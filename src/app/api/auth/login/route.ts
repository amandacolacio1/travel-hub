import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import {
  identificarOrigem,
  limparTentativas,
  registrarTentativa,
} from "@/server/auth/limite-de-tentativas";
import {
  consumirTempoDeVerificacao,
  verificarSenha,
} from "@/server/auth/senha";
import { criarSessao } from "@/server/auth/sessao";
import { buscarUsuarioPorEmail } from "@/server/auth/usuarios-mock";

/** Mesma resposta para e-mail inexistente e senha errada (§2.1). */
const CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos";

const DURACAO_MINIMA_MS = 400;

const SEM_CACHE = { "Cache-Control": "no-store" };

async function aguardarDuracaoMinima(inicio: number) {
  const restante = DURACAO_MINIMA_MS - (Date.now() - inicio);
  if (restante > 0) {
    await new Promise((resolve) => setTimeout(resolve, restante));
  }
}

export async function POST(request: Request) {
  const inicio = Date.now();
  const origem = identificarOrigem(request);

  const limite = registrarTentativa(origem);
  if (limite.bloqueado) {
    await aguardarDuracaoMinima(inicio);
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente mais tarde." },
      {
        status: 429,
        headers: { ...SEM_CACHE, "Retry-After": String(limite.esperarSegundos) },
      },
    );
  }

  const corpo = await request.json().catch(() => null);
  const validacao = loginSchema.safeParse(corpo);

  if (!validacao.success) {
    await aguardarDuracaoMinima(inicio);
    return NextResponse.json(
      { message: CREDENCIAIS_INVALIDAS },
      { status: 401, headers: SEM_CACHE },
    );
  }

  const { email, senha } = validacao.data;
  const usuario = buscarUsuarioPorEmail(email);

  // Sem usuário, ainda assim gasta o tempo de um scrypt para não vazar a
  // existência do e-mail pela duração da resposta (§2.1).
  if (!usuario) {
    await consumirTempoDeVerificacao();
    await aguardarDuracaoMinima(inicio);
    return NextResponse.json(
      { message: CREDENCIAIS_INVALIDAS },
      { status: 401, headers: SEM_CACHE },
    );
  }

  const senhaConfere = await verificarSenha(senha, usuario.senhaHash);

  if (!senhaConfere) {
    await aguardarDuracaoMinima(inicio);
    return NextResponse.json(
      { message: CREDENCIAIS_INVALIDAS },
      { status: 401, headers: SEM_CACHE },
    );
  }

  const sessao = await criarSessao(usuario);
  limparTentativas(origem);

  await aguardarDuracaoMinima(inicio);
  return NextResponse.json(sessao, { status: 200, headers: SEM_CACHE });
}
