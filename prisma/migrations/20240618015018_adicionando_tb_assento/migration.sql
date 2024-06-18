-- CreateEnum
CREATE TYPE "SpotStatus" AS ENUM ('available', 'reserved');

-- CreateTable
CREATE TABLE "tb_assento" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "SpotStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_assento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_assento" ADD CONSTRAINT "tb_assento_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
