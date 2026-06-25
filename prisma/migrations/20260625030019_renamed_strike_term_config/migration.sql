/*
  Warnings:

  - You are about to drop the `StrikeTermConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StrikeTermConfig";

-- CreateTable
CREATE TABLE "StrikeTerm" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrikeTerm_pkey" PRIMARY KEY ("id")
);
