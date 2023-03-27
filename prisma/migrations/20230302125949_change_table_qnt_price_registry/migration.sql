/*
  Warnings:

  - Added the required column `product_group_id` to the `qnt_price_registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qnt_price_registry" ADD COLUMN     "product_group_id" INTEGER NOT NULL,
ALTER COLUMN "qnt" SET DATA TYPE DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
