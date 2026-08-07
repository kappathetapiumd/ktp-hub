/*
  Warnings:

  - Added the required column `salt` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "salt" TEXT NOT NULL;
