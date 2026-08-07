/*
  Warnings:

  - You are about to drop the column `salt` on the `PasswordResetToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "salt";
