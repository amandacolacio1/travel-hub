import { z } from "zod";
import { dataPrevistaSchema } from "@/features/auth/schemas/sessao.schema";
import type { TripStatus } from "../types/trip";

export const tripStatusSchema = z.enum([
  "planejando",
  "escolhida",
  "realizada",
]) satisfies z.ZodType<TripStatus>;

/** Corpo do `POST /api/viagens`. O código do país é decidido no servidor. */
export const createTripSchema = z.object({
  pais: z.string().trim().min(1, "Informe o país").max(80),
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
