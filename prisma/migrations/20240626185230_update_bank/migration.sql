/*
  Warnings:

  - You are about to drop the column `organization` on the `tb_evento` table. All the data in the column will be lost.
  - Added the required column `location` to the `tb_evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_evento" DROP COLUMN "organization",
ADD COLUMN     "location" VARCHAR(200) NOT NULL;
