-- CreateTable
CREATE TABLE "Voluntary" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Voluntary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "voluntaryId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voluntary_email_key" ON "Voluntary"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_voluntaryId_cardId_key" ON "Participation"("voluntaryId", "cardId");

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_voluntaryId_fkey" FOREIGN KEY ("voluntaryId") REFERENCES "Voluntary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
