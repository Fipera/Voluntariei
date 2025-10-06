/*
  Warnings:

  - Added the required column `endAt` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxVolunteers` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'PENDING', 'FINALIZED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maxVolunteers" INTEGER NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Participation" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "status" "ParticipationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "_CardToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CardToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CardToSkill_B_index" ON "_CardToSkill"("B");

-- AddForeignKey
ALTER TABLE "_CardToSkill" ADD CONSTRAINT "_CardToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToSkill" ADD CONSTRAINT "_CardToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
