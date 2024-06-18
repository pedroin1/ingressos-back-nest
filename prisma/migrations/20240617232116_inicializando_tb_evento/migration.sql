/*
  Warnings:

  - You are about to drop the `tb_venda` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "tb_venda";

-- CreateTable
CREATE TABLE "tb_evento" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_evento_pkey" PRIMARY KEY ("id")
);
