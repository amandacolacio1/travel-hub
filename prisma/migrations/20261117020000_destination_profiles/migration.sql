-- CreateEnum
CREATE TYPE "StatusFicha" AS ENUM ('PENDENTE', 'GERANDO', 'PRONTA', 'ERRO');

-- AlterTable
ALTER TABLE "destinos" ADD COLUMN     "ficha" JSONB,
ADD COLUMN     "ficha_atualizada_em" TIMESTAMP(3),
ADD COLUMN     "ficha_fonte" TEXT,
ADD COLUMN     "ficha_status" "StatusFicha" NOT NULL DEFAULT 'PENDENTE';

-- CreateIndex
CREATE INDEX "destinos_ficha_status_idx" ON "destinos"("ficha_status");

