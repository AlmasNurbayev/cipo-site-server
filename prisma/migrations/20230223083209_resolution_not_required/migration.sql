-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_product_folder_id_fkey";

-- AlterTable
ALTER TABLE "image_registry" ALTER COLUMN "resolution" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "product_folder_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_vid" ALTER COLUMN "id_1c" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_folder_id_fkey" FOREIGN KEY ("product_folder_id") REFERENCES "product_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
