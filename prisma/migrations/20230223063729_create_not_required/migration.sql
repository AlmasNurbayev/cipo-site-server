-- AlterTable
ALTER TABLE "brend" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "country" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "image_registry" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "price_registry" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "price_vid" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_desc_mapping" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_group" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_vid" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "qnt_registry" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registrator" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "size" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "store" ALTER COLUMN "create_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "create_date" DROP NOT NULL;
