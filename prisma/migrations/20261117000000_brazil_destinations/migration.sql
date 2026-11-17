-- DropIndex
DROP INDEX "destinos_codigo_pais_cidade_key";

-- AlterTable
ALTER TABLE "destinos" DROP COLUMN "bandeira_url",
DROP COLUMN "codigo_pais",
DROP COLUMN "moeda",
DROP COLUMN "pais",
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "ibge_id" INTEGER NOT NULL,
ADD COLUMN     "regiao" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "uf" CHAR(2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "destinos_slug_key" ON "destinos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "destinos_ibge_id_key" ON "destinos"("ibge_id");

-- CreateIndex
CREATE INDEX "destinos_uf_idx" ON "destinos"("uf");

