/*
  Warnings:

  - Added the required column `eventDate` to the `tb_evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `tb_evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `tb_evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_evento" ADD COLUMN     "eventDate" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "image_url" VARCHAR(200) NOT NULL,
ADD COLUMN     "organization" VARCHAR(200) NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;
