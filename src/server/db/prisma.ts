import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function criarCliente() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não definida. Veja .env.example.");
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/**
 * Em dev, o hot reload do Next reexecuta este módulo a cada mudança; sem
 * guardar a instância no `globalThis`, cada reload abriria um novo pool de
 * conexões até estourar o limite do Neon.
 */
const globalParaPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof criarCliente>;
};

export const prisma = globalParaPrisma.prisma ?? criarCliente();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
