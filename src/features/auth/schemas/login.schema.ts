import { z } from "zod";
import { emailSchema, senhaSchema } from "./senha.schema";

export const loginSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
});

export type LoginFormData = z.input<typeof loginSchema>;
export type LoginPayload = z.output<typeof loginSchema>;
