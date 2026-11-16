import { INTERESTS } from "@/features/auth/constants/interests";
import type { Session } from "@/shared/session";
import { INTERESSE_DA_CATEGORIA, PERFIL_FRASE } from "../constants/rotulos";
import type { Destino, Experiencia, InteresseId } from "../types/destino";
import {
  faixaDeClima,
  formatarBRL,
  periodoDosMeses,
} from "./formatadores";
import { DIAS_DE_VIAGEM, PERFIL_AFINIDADE, custoEstimado } from "./score";

export type Motivo = {
  id: "orcamento" | "clima" | "perfil";
  titulo: string;
  descricao: string;
};

export type Prioridade = {
  id: InteresseId;
  titulo: string;
  descricao: string;
};

const MAX_PRIORIDADES = 4;
const LIMITE_AFINIDADE_ALTA = 8;

function tituloDoInteresse(id: InteresseId): string {
  return INTERESTS.find((interesse) => interesse.id === id)?.titulo ?? id;
}

function motivoDeOrcamento(destino: Destino, session: Session): Motivo {
  const estimado = custoEstimado(destino);
  const limite = session.preferencias.orcamentoFinal;
  const base = `Estimativa de ${formatarBRL(estimado)} para ${DIAS_DE_VIAGEM} dias`;

  return estimado <= limite
    ? {
        id: "orcamento",
        titulo: "Orçamento dentro do limite",
        descricao: `${base}, abaixo do seu teto de ${formatarBRL(limite)}.`,
      }
    : {
        id: "orcamento",
        titulo: "Orçamento acima do planejado",
        descricao: `${base}, ${formatarBRL(estimado - limite)} acima do seu teto de ${formatarBRL(limite)}.`,
      };
}

function motivoDeClima(destino: Destino): Motivo {
  const { clima, melhorEpoca } = destino;

  return {
    id: "clima",
    titulo: `Clima ${clima.descricao.toLowerCase()}`,
    descricao: `Média histórica de ${faixaDeClima(clima)}. Melhor época: ${periodoDosMeses(melhorEpoca.meses)}.`,
  };
}

function motivoDePerfil(destino: Destino, session: Session): Motivo {
  const interesse = PERFIL_AFINIDADE[session.perfilViagem];

  return {
    id: "perfil",
    titulo: `Combina com viagens ${PERFIL_FRASE[session.perfilViagem]}`,
    descricao: `Nota ${destino.afinidade[interesse]}/10 em ${tituloDoInteresse(interesse).toLowerCase()}, prioridade de quem viaja ${PERFIL_FRASE[session.perfilViagem]}.`,
  };
}

/** Os três critérios que sustentam o score, escritos para o usuário. */
export function motivosDeCompatibilidade(
  destino: Destino,
  session: Session,
): Motivo[] {
  return [
    motivoDeOrcamento(destino, session),
    motivoDeClima(destino),
    motivoDePerfil(destino, session),
  ];
}

/** Interesses escolhidos no cadastro, mais o que pesa para o perfil de viagem. */
export function prioridadesDoUsuario(session: Session): Prioridade[] {
  const ids = new Set<string>([
    ...session.preferencias.interesses,
    PERFIL_AFINIDADE[session.perfilViagem],
  ]);

  return INTERESTS.filter((interesse) => ids.has(interesse.id))
    .slice(0, MAX_PRIORIDADES)
    .map(({ icon, titulo, descricao }) => ({ id: icon, titulo, descricao }));
}

/** "Match perfeito": serve ao perfil de viagem e à categoria que o usuário curte. */
export function experienciaCombina(
  experiencia: Experiencia,
  session: Session,
): boolean {
  return (
    experiencia.perfis.includes(session.perfilViagem) &&
    session.preferencias.interesses.includes(
      INTERESSE_DA_CATEGORIA[experiencia.categoria],
    )
  );
}

/** Compatibilidade (0–99%) de uma experiência com o interesse e o perfil do usuário. */
export function compatibilidadeDaExperiencia(
  experiencia: Experiencia,
  destino: Destino,
  session: Session,
): number {
  const interesse = INTERESSE_DA_CATEGORIA[experiencia.categoria];
  const afinidade = destino.afinidade[interesse] * 10;
  const nota = session.preferencias.interesses.includes(interesse)
    ? afinidade
    : afinidade * 0.8;
  const perfil = experiencia.perfis.includes(session.perfilViagem) ? 100 : 50;

  return Math.min(99, Math.round(nota * 0.5 + perfil * 0.5));
}

/** Interesses do usuário em que o destino é especialmente forte. */
export function interessesEmComum(
  destino: Destino,
  session: Session,
): string[] {
  return session.preferencias.interesses
    .filter(
      (id): id is InteresseId =>
        id in destino.afinidade &&
        destino.afinidade[id as InteresseId] >= LIMITE_AFINIDADE_ALTA,
    )
    .map(tituloDoInteresse);
}
