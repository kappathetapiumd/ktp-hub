-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- CreateTable
CREATE TABLE "StrikeTermConfig" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrikeTermConfig_pkey" PRIMARY KEY ("id")
);
