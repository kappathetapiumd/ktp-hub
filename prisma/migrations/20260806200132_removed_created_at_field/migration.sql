/*
  Warnings:

  - You are about to drop the column `createdAt` on the `GroupTask` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupTask" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "createdAt";
