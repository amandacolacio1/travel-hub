-- Interesses do usuário passam de tabela de ligação para um array em `preferencias`.

-- AlterTable
ALTER TABLE "preferencias" ADD COLUMN     "interesses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Copia os interesses que já existem antes de apagar a tabela antiga.
UPDATE "preferencias" AS p
SET "interesses" = ARRAY(
  SELECT i."slug"
  FROM "usuario_interesses" AS ui
  JOIN "interesses" AS i ON i."id" = ui."interesse_id"
  WHERE ui."usuario_id" = p."usuario_id"
  ORDER BY i."id"
);

-- DropForeignKey
ALTER TABLE "usuario_interesses" DROP CONSTRAINT "usuario_interesses_interesse_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_interesses" DROP CONSTRAINT "usuario_interesses_usuario_id_fkey";

-- DropTable
DROP TABLE "usuario_interesses";
