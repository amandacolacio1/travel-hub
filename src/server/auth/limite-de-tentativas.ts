import "server-only";

const JANELA_MS = 15 * 60 * 1000;
const MAXIMO_TENTATIVAS = 5;

type Registro = {
  tentativas: number;
  reiniciaEm: number;
};

/**
 * Contagem em memória — zera a cada restart e não é compartilhada entre
 * instâncias. Suficiente para o mock; em produção precisa de Redis.
 */
const registros = new Map<string, Registro>();

export type ResultadoDoLimite = {
  bloqueado: boolean;
  /** Segundos até liberar, para o cabeçalho `Retry-After`. */
  esperarSegundos: number;
};

export function registrarTentativa(chave: string): ResultadoDoLimite {
  const agora = Date.now();
  const registro = registros.get(chave);

  if (!registro || registro.reiniciaEm <= agora) {
    registros.set(chave, { tentativas: 1, reiniciaEm: agora + JANELA_MS });
    return { bloqueado: false, esperarSegundos: 0 };
  }

  registro.tentativas += 1;

  if (registro.tentativas > MAXIMO_TENTATIVAS) {
    return {
      bloqueado: true,
      esperarSegundos: Math.ceil((registro.reiniciaEm - agora) / 1000),
    };
  }

  return { bloqueado: false, esperarSegundos: 0 };
}

/** Chamado após login bem-sucedido para não punir quem acertou. */
export function limparTentativas(chave: string): void {
  registros.delete(chave);
}

export function identificarOrigem(request: Request): string {
  const encaminhado = request.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();

  return request.headers.get("x-real-ip") ?? "desconhecido";
}
