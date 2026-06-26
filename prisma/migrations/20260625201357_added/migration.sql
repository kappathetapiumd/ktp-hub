/*
  Warnings:

  - Added the required column `isActive` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
