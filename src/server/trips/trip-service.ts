import "server-only";

import type { Prisma, StatusViagem } from "@/generated/prisma/client";
import { MAX_DESTINATIONS } from "@/features/auth/constants/destinations";
import type {
  CreateTripPayload,
  UpdateTripPayload,
} from "@/features/destinos/schemas/trip.schema";
import type { Trip, TripStatus } from "@/features/destinos/types/trip";
import { prisma } from "@/server/db/prisma";
import { resolveDestinationOrThrow } from "@/server/destinations/resolve-destination";
import { upsertDestination } from "@/server/destinations/upsert-destination";
import { HttpError } from "@/server/http/http-error";
import { toDbDate } from "@/server/users/profile-writes";

type Tx = Prisma.TransactionClient;

const TIMEOUT_TRANSACAO_MS = 15_000;

const TRIP_INCLUDE = { destino: true } satisfies Prisma.ViagemInclude;

type ViagemComDestino = Prisma.ViagemGetPayload<{ include: typeof TRIP_INCLUDE }>;

const STATUS_NO_BANCO = {
  planejando: "PLANEJANDO",
  escolhida: "ESCOLHIDA",
  realizada: "REALIZADA",
} as const satisfies Record<TripStatus, StatusViagem>;

function toPublicTrip(viagem: ViagemComDestino): Trip {
  return {
    id: viagem.id,
    status: viagem.status.toLowerCase() as TripStatus,
    dataPrevista: viagem.dataPrevista?.toISOString().slice(0, 10) ?? "",
    criadoEm: viagem.criadoEm.toISOString(),
    destino: {
      slug: viagem.destino.slug,
      uf: viagem.destino.uf,
      estado: viagem.destino.estado,
      cidade: viagem.destino.cidade,
    },
  };
}

/**
 * Trava a linha do usuário até o fim da transação. Sem isso, duas
 * requisições simultâneas contariam "3 planejando" ao mesmo tempo e as duas
 * criariam a 4ª — furando o limite. Com a trava, a segunda espera a
 * primeira terminar e conta 4.
 */
async function travarUsuario(tx: Tx, usuarioId: string) {
  await tx.$queryRaw`SELECT id FROM usuarios WHERE id = ${usuarioId}::uuid FOR UPDATE`;
}

/** Regra do PDF: o limite vale para as viagens com status PLANEJANDO. */
async function garantirVagaParaPlanejar(tx: Tx, usuarioId: string) {
  const planejando = await tx.viagem.count({
    where: { usuarioId, status: "PLANEJANDO" },
  });

  if (planejando >= MAX_DESTINATIONS) {
    throw new HttpError(
      422,
      `Você pode planejar até ${MAX_DESTINATIONS} destinos ao mesmo tempo.`,
    );
  }
}

/** Busca sempre filtrando pelo dono: um id de outro usuário vira 404. */
async function buscarDoUsuario(usuarioId: string, id: string) {
  const viagem = await prisma.viagem.findFirst({
    where: { id, usuarioId },
    include: TRIP_INCLUDE,
  });
  if (!viagem) throw new HttpError(404, "Viagem não encontrada");
  return toPublicTrip(viagem);
}

export async function listTrips(usuarioId: string): Promise<Trip[]> {
  const viagens = await prisma.viagem.findMany({
    where: { usuarioId },
    include: TRIP_INCLUDE,
    orderBy: [{ criadoEm: "asc" }, { id: "asc" }],
  });
  return viagens.map(toPublicTrip);
}

/**
 * "Salvar um destino" do PDF: upsert em `destinos` + linha em `viagens`.
 * Destino repetido estoura o `@@unique([usuarioId, destinoId])` (P2002).
 */
export async function createTrip(
  usuarioId: string,
  { uf, cidade, dataPrevista }: CreateTripPayload,
): Promise<Trip> {
  // Confere a cidade no IBGE antes de abrir a transação (é chamada de rede).
  const destino = await resolveDestinationOrThrow(uf, cidade);

  const { id } = await prisma.$transaction(
    async (tx) => {
      await travarUsuario(tx, usuarioId);
      await garantirVagaParaPlanejar(tx, usuarioId);

      const destinoId = await upsertDestination(tx, destino);

      return tx.viagem.create({
        data: { usuarioId, destinoId, dataPrevista: toDbDate(dataPrevista ?? "") },
        select: { id: true },
      });
    },
    { timeout: TIMEOUT_TRANSACAO_MS },
  );

  return buscarDoUsuario(usuarioId, id);
}

export async function updateTrip(
  usuarioId: string,
  id: string,
  { status, dataPrevista }: UpdateTripPayload,
): Promise<Trip> {
  await prisma.$transaction(
    async (tx) => {
      await travarUsuario(tx, usuarioId);

      const atual = await tx.viagem.findFirst({
        where: { id, usuarioId },
        select: { status: true },
      });
      if (!atual) throw new HttpError(404, "Viagem não encontrada");

      // Voltar uma viagem para "planejando" ocupa uma vaga do limite.
      if (status === "planejando" && atual.status !== "PLANEJANDO") {
        await garantirVagaParaPlanejar(tx, usuarioId);
      }

      await tx.viagem.update({
        where: { id },
        data: {
          status: status && STATUS_NO_BANCO[status],
          dataPrevista: dataPrevista === undefined ? undefined : toDbDate(dataPrevista),
        },
      });
    },
    { timeout: TIMEOUT_TRANSACAO_MS },
  );

  return buscarDoUsuario(usuarioId, id);
}

/**
 * Remove só a viagem; a cópia em `destinos` fica, porque é compartilhada
 * com outros usuários.
 */
export async function deleteTrip(usuarioId: string, id: string): Promise<void> {
  const { count } = await prisma.viagem.deleteMany({ where: { id, usuarioId } });
  if (count === 0) throw new HttpError(404, "Viagem não encontrada");
}
