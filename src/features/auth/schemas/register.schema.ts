import { z } from "zod";
import { nomeSchema } from "./conta.schema";
import { emailSchema, senhaSchema } from "./senha.schema";
import { perfilViagemSchema, preferenciasSchema } from "./sessao.schema";

/**
 * Corpo do `POST /api/auth/register` — o `AuthPayload` que o wizard monta.
 * Reaproveita as regras das etapas para o backend aplicar exatamente o que a
 * interface promete.
 */
export const registerSchema = z.object({
  conta: z.object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaSchema,
  }),
  preferencias: preferenciasSchema.refine(
    (dados) => dados.orcamentoFinal >= dados.orcamentoInicial,
    {
      message: "O valor final deve ser maior ou igual ao inicial",
      path: ["orcamentoFinal"],
    },
  ),
  perfilViagem: perfilViagemSchema,
});

export type RegisterPayload = z.output<typeof registerSchema>;
