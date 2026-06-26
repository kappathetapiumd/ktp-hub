/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `StrikeEvent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StrikeTerm` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StrikeTerm` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StrikeEvent" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "StrikeTerm" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
