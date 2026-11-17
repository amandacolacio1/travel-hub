import "server-only";

import { z } from "zod";
import type { Destino } from "@/features/destinos/types/destino";

/** Campos que vêm do IBGE (tabela `destinos`), não da ficha. */
type Identidade = "slug" | "cidade" | "uf" | "estado" | "regiao";

/** Ficha de um destino: tudo do tipo `Destino` que não é identidade. */
export type DestinationProfile = Omit<Destino, Identidade>;

const nota = z.number().min(0).max(10);
const texto = (max: number) => z.string().trim().min(1).max(max);

const pontoDeInteresseSchema = z.object({
  id: texto(80),
  nome: texto(80),
  categoria: texto(30),
  descricao: texto(300),
  imagem: z.string().optional(),
});

const experienciaSchema = z.object({
  id: texto(120),
  titulo: texto(100),
  descricao: texto(300),
  categoria: z.enum(["gastronomia", "natureza", "cultura", "noturno"]),
  perfis: z.array(z.enum(["sozinho", "casal", "familia"])).min(1),
  preco: z.number().min(0).max(10_000),
  duracao: texto(30),
  nivel: texto(30),
  imagem: z.string().optional(),
});

/**
 * Validação de qualquer ficha antes de gravar — da IA, do gerador falso ou
 * editorial. Ficha que não passa aqui não entra no banco, e o destino fica
 * com status ERRO.
 */
export const destinationProfileSchema = z.object({
  tema: texto(80),
  frase: texto(160),
  resumo: texto(300),
  descricao: texto(1200),
  /** URL da foto, ou vazio (a tela mostra um fundo neutro). */
  imagem: z.string(),
  nota,
  clima: z.object({
    minC: z.number().min(-20).max(50),
    maxC: z.number().min(-20).max(50),
    tipo: z.enum(["sol", "parcial", "frio", "chuva"]),
    descricao: texto(40),
    diasChuvososPct: z.number().min(0).max(100),
  }),
  melhorEpoca: z.object({
    estacao: texto(40),
    meses: z.array(z.number().int().min(1).max(12)).min(1).max(12),
  }),
  custoDiarioBRL: z.number().positive().max(20_000),
  afinidade: z.object({
    natureza: nota,
    cultura: nota,
    gastronomia: nota,
    familia: nota,
    romance: nota,
    economia: nota,
  }),
  vibe: z.array(texto(30)).min(1).max(5),
  pontosFortes: z.array(texto(200)).min(1).max(6),
  pontosDeAtencao: z.array(texto(200)).min(1).max(6),
  pontosDeInteresse: z.array(pontoDeInteresseSchema).min(1).max(8),
  experiencias: z.array(experienciaSchema).min(1).max(8),
}) satisfies z.ZodType<DestinationProfile>;
