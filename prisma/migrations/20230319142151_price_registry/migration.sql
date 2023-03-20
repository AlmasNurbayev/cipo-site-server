/*
  Warnings:

  - Added the required column `price_vid_id` to the `price_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_vid_name_1c` to the `price_registry` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id_1c` on table `price_registry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "price_registry" ADD COLUMN     "price_vid_id" INTEGER NOT NULL,
ADD COLUMN     "price_vid_name_1c" TEXT NOT NULL,
ALTER COLUMN "product_id_1c" SET NOT NULL;
