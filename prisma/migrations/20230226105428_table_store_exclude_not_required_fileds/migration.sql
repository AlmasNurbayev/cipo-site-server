-- AlterTable
ALTER TABLE "price_vid" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "store" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "link_2gis" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL;
