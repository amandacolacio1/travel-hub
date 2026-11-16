import { z } from "zod";
import { nomeSchema } from "./conta.schema";
import { emailSchema } from "./senha.schema";

export const perfilViagemSchema = z.enum(["sozinho", "casal", "familia"]);

const destinoSchema = z.object({
  pais: z.string().trim().max(80),
  cidade: z.string().trim().max(80),
});

export const preferenciasSchema = z.object({
  interesses: z.array(z.string().trim().max(40)).max(20),
  orcamentoInicial: z.number().int().min(0).max(10_000_000),
  orcamentoFinal: z.number().int().min(0).max(10_000_000),
  destinos: z.array(destinoSchema).max(10),
  dataPrevista: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .or(z.literal("")),
});

/** Foto enviada já reduzida pelo navegador (data URL), ou `null` para remover. */
export const FOTO_TAMANHO_MAXIMO = 200_000;

export const fotoSchema = z
  .string()
  .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/, "Imagem inválida")
  .max(FOTO_TAMANHO_MAXIMO, "Imagem muito grande")
  .nullable();

export const usuarioSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  fotoUrl: fotoSchema,
  pais: z.string().trim().max(80),
  cidade: z.string().trim().max(80),
});

export const atualizarSessaoSchema = z
  .object({
    perfilViagem: perfilViagemSchema.optional(),
    preferencias: preferenciasSchema.partial().optional(),
    usuario: usuarioSchema.partial().optional(),
  })
  .refine(
    (dados) =>
      dados.perfilViagem !== undefined ||
      dados.preferencias ||
      dados.usuario,
    "Nada para atualizar",
  )
  .refine(
    (dados) =>
      dados.preferencias?.orcamentoInicial === undefined ||
      dados.preferencias?.orcamentoFinal === undefined ||
      dados.preferencias.orcamentoFinal >= dados.preferencias.orcamentoInicial,
    {
      message: "O valor final deve ser maior ou igual ao inicial",
      path: ["preferencias", "orcamentoFinal"],
    },
  );

export type AtualizarSessaoPayload = z.infer<typeof atualizarSessaoSchema>;
