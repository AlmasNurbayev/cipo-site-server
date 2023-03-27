/*
  Warnings:

  - Added the required column `price_vid_name_1c` to the `price_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name_1c` to the `price_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_name_1c` to the `price_registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "price_registry" ADD COLUMN     "price_vid_name_1c" TEXT NOT NULL,
ADD COLUMN     "product_artikul" TEXT,
ADD COLUMN     "product_id_1c" TEXT,
ADD COLUMN     "product_name_1c" TEXT NOT NULL,
ADD COLUMN     "size_name_1c" TEXT NOT NULL;
