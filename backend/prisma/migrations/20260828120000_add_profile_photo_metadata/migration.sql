ALTER TABLE "User"
ADD COLUMN "photoUrl" TEXT,
ADD COLUMN "photoPublicId" TEXT;

UPDATE "User"
SET "photoUrl" = "photo"
WHERE "photo" IS NOT NULL AND "photoUrl" IS NULL;
