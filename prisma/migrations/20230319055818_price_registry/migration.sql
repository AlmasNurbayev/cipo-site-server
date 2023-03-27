/*
  Warnings:

  - You are about to drop the column `price_vid_id` on the `price_registry` table. All the data in the column will be lost.
  - You are about to drop the column `price_vid_name_1c` on the `price_registry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "price_registry" DROP CONSTRAINT "price_registry_price_vid_id_fkey";

-- AlterTable
ALTER TABLE "price_registry" DROP COLUMN "price_vid_id",
DROP COLUMN "price_vid_name_1c";
