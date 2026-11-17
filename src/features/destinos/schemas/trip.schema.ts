import { z } from "zod";
import { dataPrevistaSchema } from "@/features/auth/schemas/sessao.schema";
import type { TripStatus } from "../types/trip";

export const tripStatusSchema = z.enum([
  "planejando",
  "escolhida",
  "realizada",
]) satisfies z.ZodType<TripStatus>;

/** Sigla de estado: duas letras. Se o estado existe, quem decide é o IBGE. */
export const ufSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{2}$/, "Estado inválido")
  .transform((uf) => uf.toUpperCase());

/** Corpo do `POST /api/viagens`. A cidade é conferida no IBGE pelo servidor. */
export const createTripSchema = z.object({
  uf: ufSchema,
  cidade: z.string().trim().min(1, "Informe a cidade").max(80),
  dataPrevista: dataPrevistaSchema.optional(),
});

/** Corpo do `PATCH /api/viagens/[id]`. */
export const updateTripSchema = z
  .object({
    status: tripStatusSchema.optional(),
    dataPrevista: dataPrevistaSchema.optional(),
  })
  .refine(
    (dados) => dados.status !== undefined || dados.dataPrevista !== undefined,
    "Nada para atualizar",
  );

export type CreateTripPayload = z.infer<typeof createTripSchema>;
export type UpdateTripPayload = z.infer<typeof updateTripSchema>;
