-- AlterTable
ALTER TABLE "StrikeTermConfig" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weeks" TEXT[];
