import { z } from "zod";

export const SENHA_TAMANHO_MINIMO = 8;
export const SENHA_TAMANHO_MAXIMO = 64;

/**
 * Regra única de senha, compartilhada entre formulários e Route Handlers: o
 * backend precisa aplicar exatamente o que a interface promete.
 */
export const senhaSchema = z
  .string()
  .min(SENHA_TAMANHO_MINIMO, `Mínimo ${SENHA_TAMANHO_MINIMO} caracteres`)
  .max(SENHA_TAMANHO_MAXIMO, `Máximo ${SENHA_TAMANHO_MAXIMO} caracteres`);

/** Troca de senha logado: exige a atual, para que uma sessão roubada não vire conta roubada. */
export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual"),
    novaSenha: senhaSchema,
    confirmacao: z.string(),
  })
  .refine((dados) => dados.novaSenha === dados.confirmacao, {
    message: "As senhas não coincidem",
    path: ["confirmacao"],
  })
  .refine((dados) => dados.novaSenha !== dados.senhaAtual, {
    message: "A nova senha deve ser diferente da atual",
    path: ["novaSenha"],
  });

export type AlterarSenhaFormData = z.input<typeof alterarSenhaSchema>;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail")
  .pipe(z.email("Informe um e-mail válido"))
  .transform((valor) => valor.toLowerCase());
