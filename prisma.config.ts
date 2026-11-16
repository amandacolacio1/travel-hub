import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Configuração do Prisma CLI (migrate, studio, seed).
 *
 * Migrations usam a conexão direta do Neon (`DIRECT_URL`), porque o pooler
 * (PgBouncer) não suporta tudo o que o `migrate` precisa. O app em runtime
 * usa a conexão com pooling (`DATABASE_URL`) — ver src/server/db/prisma.ts.
 *
 * `process.env` em vez de `env()`: `env()` lança erro se a variável não
 * existir, e o `prisma generate` do build (Vercel) não precisa de banco.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
