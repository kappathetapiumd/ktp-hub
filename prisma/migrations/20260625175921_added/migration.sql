-- CreateTable
CREATE TABLE "Session" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "membershipCommittee" BOOLEAN NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);
