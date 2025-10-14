/*
  Warnings:

  - You are about to drop the column `endAt` on the `Card` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Primeiro adiciona a coluna com valor padrão, depois calcula duração baseado em endAt
ALTER TABLE "Card" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 240;

-- Atualiza duration com base na diferença entre endAt e startAt (em minutos)
UPDATE "Card" SET "duration" = EXTRACT(EPOCH FROM ("endAt" - "startAt")) / 60;

-- Garante que nenhuma duração exceda 1439 minutos (23h59m)
UPDATE "Card" SET "duration" = 1439 WHERE "duration" > 1439;

-- Agora remove a coluna endAt
ALTER TABLE "Card" DROP COLUMN "endAt";
