import { z } from "zod";
import { emailSchema, senhaSchema } from "./senha.schema";

export const nomeSchema = z
  .string()
  .trim()
  .min(3, "Informe seu nome completo")
  .max(120, "Máximo 120 caracteres");

export const contaSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaSchema,
    confirmacaoSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmacaoSenha, {
    message: "As senhas não coincidem",
    path: ["confirmacaoSenha"],
  });

export type ContaFormData = z.input<typeof contaSchema>;
export type ContaPayload = z.output<typeof contaSchema>;
