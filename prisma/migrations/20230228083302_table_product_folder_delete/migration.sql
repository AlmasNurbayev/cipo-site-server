/*
  Warnings:

  - You are about to drop the column `product_folder_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `product_folder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_product_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "product_folder" DROP CONSTRAINT "product_folder_registrator_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "product_folder_id",
ADD COLUMN     "product_folder" TEXT;

-- DropTable
DROP TABLE "product_folder";
