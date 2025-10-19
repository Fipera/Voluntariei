-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('VOLUNTARY', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_OPPORTUNITY', 'NEW_APPLICATION', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'OPPORTUNITY_CANCELED', 'OPPORTUNITY_STARTING');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userType" "UserType" NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "cardId" INTEGER,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
