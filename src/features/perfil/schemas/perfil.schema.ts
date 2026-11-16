import { z } from "zod";
import { nomeSchema } from "@/features/auth/schemas/conta.schema";
import { emailSchema } from "@/features/auth/schemas/senha.schema";

export const perfilFormSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  pais: z.string(),
  cidade: z.string(),
  interesses: z.array(z.string()),
  /** Data URL da foto já reduzida, ou `null` sem foto. */
  fotoUrl: z.string().nullable(),
});

export type PerfilFormData = z.infer<typeof perfilFormSchema>;
