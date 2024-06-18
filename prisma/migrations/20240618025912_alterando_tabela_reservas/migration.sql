/*
  Warnings:

  - The values [reserved,canceled] on the enum `TicketKind` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `status` to the `tb_resevation_history` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('reserved', 'canceled');

-- AlterEnum
BEGIN;
CREATE TYPE "TicketKind_new" AS ENUM ('full', 'half');
ALTER TABLE "tb_ticket" ALTER COLUMN "ticketKind" TYPE "TicketKind_new" USING ("ticketKind"::text::"TicketKind_new");
ALTER TABLE "tb_resevation_history" ALTER COLUMN "ticketKind" TYPE "TicketKind_new" USING ("ticketKind"::text::"TicketKind_new");
ALTER TYPE "TicketKind" RENAME TO "TicketKind_old";
ALTER TYPE "TicketKind_new" RENAME TO "TicketKind";
DROP TYPE "TicketKind_old";
COMMIT;

-- AlterTable
ALTER TABLE "tb_resevation_history" ADD COLUMN     "status" "TicketStatus" NOT NULL;
