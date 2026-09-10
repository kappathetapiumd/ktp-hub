-- Compatibility for application instances running the schema from before
-- dynamic requirements were introduced. New code does not use these fields.
ALTER TABLE "User"
  ADD COLUMN "philSmallEvent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "philBigEvent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "profDevEventA" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "profDevEventB" BOOLEAN NOT NULL DEFAULT false;
