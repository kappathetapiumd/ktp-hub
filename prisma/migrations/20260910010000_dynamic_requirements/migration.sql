BEGIN;
CREATE TYPE "RequirementAudience" AS ENUM ('ALL', 'BROTHERS', 'PLEDGES');
CREATE TABLE "Requirement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "appliesTo" "RequirementAudience" NOT NULL DEFAULT 'ALL',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "RequirementCompletion" (
  "userId" TEXT NOT NULL,
  "requirementId" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("userId", "requirementId"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "RequirementCompletion_requirementId_idx" ON "RequirementCompletion"("requirementId");
INSERT INTO "Requirement" ("id", "name", "category", "updatedAt") VALUES
  ('legacy-phil-small', 'Small Event', 'Philanthropy', CURRENT_TIMESTAMP),
  ('legacy-phil-big', 'Big Event', 'Philanthropy', CURRENT_TIMESTAMP),
  ('legacy-prof-a', 'Event #1', 'Professional Development', CURRENT_TIMESTAMP),
  ('legacy-prof-b', 'Event #2', 'Professional Development', CURRENT_TIMESTAMP);
INSERT INTO "RequirementCompletion" ("userId", "requirementId")
SELECT "id", 'legacy-phil-small' FROM "User" WHERE "philSmallEvent"
UNION ALL SELECT "id", 'legacy-phil-big' FROM "User" WHERE "philBigEvent"
UNION ALL SELECT "id", 'legacy-prof-a' FROM "User" WHERE "profDevEventA"
UNION ALL SELECT "id", 'legacy-prof-b' FROM "User" WHERE "profDevEventB";
ALTER TABLE "User" DROP COLUMN "philSmallEvent", DROP COLUMN "philBigEvent",
  DROP COLUMN "profDevEventA", DROP COLUMN "profDevEventB";
COMMIT;
