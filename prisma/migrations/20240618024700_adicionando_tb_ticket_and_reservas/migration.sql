-- CreateEnum
CREATE TYPE "TicketKind" AS ENUM ('reserved', 'canceled');

-- CreateTable
CREATE TABLE "tb_ticket" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ticketKind" "TicketKind" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "tb_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_resevation_history" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ticketKind" "TicketKind" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "tb_resevation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_ticket_spotId_key" ON "tb_ticket"("spotId");

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "tb_assento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_resevation_history" ADD CONSTRAINT "tb_resevation_history_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "tb_assento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
