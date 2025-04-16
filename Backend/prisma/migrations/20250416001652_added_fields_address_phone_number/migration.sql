-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "address" JSONB,
ADD COLUMN     "phoneNumber" INTEGER;

-- AlterTable
ALTER TABLE "Voluntary" ADD COLUMN     "address" JSONB,
ADD COLUMN     "phoneNumber" INTEGER;
