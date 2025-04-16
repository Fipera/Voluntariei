/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Voluntary` will be added. If there are existing duplicate values, this will fail.
  - Made the column `address` on table `Institution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Institution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Voluntary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Voluntary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Institution" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "Voluntary" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Institution_phoneNumber_key" ON "Institution"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Voluntary_phoneNumber_key" ON "Voluntary"("phoneNumber");
