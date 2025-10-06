/*
  Warnings:

  - You are about to drop the column `location` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "location",
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "locationNote" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "numberHouse" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;
