/*
  Warnings:

  - Added the required column `main` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `main_change_date` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_2gis` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image_registry" ADD COLUMN     "main" BOOLEAN NOT NULL,
ADD COLUMN     "main_change_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "link_2gis" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
