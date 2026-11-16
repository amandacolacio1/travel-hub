-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PerfilViagem" AS ENUM ('SOZINHO', 'CASAL', 'FAMILIA');

-- CreateEnum
CREATE TYPE "StatusViagem" AS ENUM ('PLANEJANDO', 'ESCOLHIDA', 'REALIZADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT '',
    "cidade" TEXT NOT NULL DEFAULT '',
    "foto_url" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "perfil_viagem" "PerfilViagem" NOT NULL DEFAULT 'SOZINHO',
    "orcamento_min" DECIMAL(12,2) NOT NULL,
    "orcamento_max" DECIMAL(12,2) NOT NULL,
    "moeda" CHAR(3) NOT NULL DEFAULT 'BRL',
    "data_prevista" DATE,

    CONSTRAINT "preferencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interesses" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT NOT NULL,

    CONSTRAINT "interesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_interesses" (
    "usuario_id" UUID NOT NULL,
    "interesse_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_interesses_pkey" PRIMARY KEY ("usuario_id","interesse_id")
);

-- CreateTable
CREATE TABLE "destinos" (
    "id" UUID NOT NULL,
    "codigo_pais" CHAR(2) NOT NULL,
    "pais" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bandeira_url" TEXT,
    "moeda" CHAR(3),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),

    CONSTRAINT "destinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viagens" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "destino_id" UUID NOT NULL,
    "data_prevista" DATE,
    "status" "StatusViagem" NOT NULL DEFAULT 'PLANEJANDO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passeios" (
    "id" UUID NOT NULL,
    "api_id" TEXT NOT NULL,
    "destino_id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco" DECIMAL(12,2) NOT NULL,
    "imagem_url" TEXT,

    CONSTRAINT "passeios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passeios_salvos" (
    "usuario_id" UUID NOT NULL,
    "passeio_id" UUID NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passeios_salvos_pkey" PRIMARY KEY ("usuario_id","passeio_id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "usuario_id" UUID NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_usuario_id_key" ON "preferencias"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "interesses_slug_key" ON "interesses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "interesses_nome_key" ON "interesses"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "destinos_codigo_pais_cidade_key" ON "destinos"("codigo_pais", "cidade");

-- CreateIndex
CREATE INDEX "viagens_usuario_id_status_idx" ON "viagens"("usuario_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "viagens_usuario_id_destino_id_key" ON "viagens"("usuario_id", "destino_id");

-- CreateIndex
CREATE UNIQUE INDEX "passeios_api_id_key" ON "passeios"("api_id");

-- CreateIndex
CREATE INDEX "passeios_destino_id_idx" ON "passeios"("destino_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_token_hash_key" ON "sessoes"("token_hash");

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");

-- AddForeignKey
ALTER TABLE "preferencias" ADD CONSTRAINT "preferencias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_interesses" ADD CONSTRAINT "usuario_interesses_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_interesses" ADD CONSTRAINT "usuario_interesses_interesse_id_fkey" FOREIGN KEY ("interesse_id") REFERENCES "interesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passeios" ADD CONSTRAINT "passeios_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passeios_salvos" ADD CONSTRAINT "passeios_salvos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passeios_salvos" ADD CONSTRAINT "passeios_salvos_passeio_id_fkey" FOREIGN KEY ("passeio_id") REFERENCES "passeios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

