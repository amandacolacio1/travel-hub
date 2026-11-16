import "server-only";

import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const TAMANHO_SALT = 16;
const TAMANHO_HASH = 64;

export async function gerarHashDeSenha(senha: string): Promise<string> {
  const salt = randomBytes(TAMANHO_SALT);
  const derivada = (await scrypt(senha, salt, TAMANHO_HASH)) as Buffer;

  return `${salt.toString("hex")}:${derivada.toString("hex")}`;
}

export async function verificarSenha(
  senha: string,
  hashArmazenado: string,
): Promise<boolean> {
  const [saltHex, hashHex] = hashArmazenado.split(":");
  if (!saltHex || !hashHex) return false;

  const esperado = Buffer.from(hashHex, "hex");
  if (esperado.length !== TAMANHO_HASH) return false;

  const derivada = (await scrypt(
    senha,
    Buffer.from(saltHex, "hex"),
    TAMANHO_HASH,
  )) as Buffer;

  return timingSafeEqual(derivada, esperado);
}

/**
 * Consome o mesmo tempo de uma verificação real. Chamado quando o e-mail não
 * existe, para que a resposta não revele isso pela duração.
 */
export async function consumirTempoDeVerificacao(): Promise<void> {
  await scrypt("senha-descartada", randomBytes(TAMANHO_SALT), TAMANHO_HASH);
}
