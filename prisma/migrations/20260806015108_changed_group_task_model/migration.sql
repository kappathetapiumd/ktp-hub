/*
  Warnings:

  - You are about to drop the column `groupTasks` on the `StrikeTerm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StrikeTerm" DROP COLUMN "groupTasks";

-- CreateTable
CREATE TABLE "GroupTask" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupTask_pkey" PRIMARY KEY ("id")
);
