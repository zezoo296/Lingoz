CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "User"
DROP COLUMN "location";

ALTER TABLE "User"
ADD COLUMN "location" geography(Point, 4326);

CREATE INDEX "User_location_idx"
ON "User"
USING GIST ("location");