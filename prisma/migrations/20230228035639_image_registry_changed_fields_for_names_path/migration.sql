/*
  Warnings:

  - You are about to drop the column `file` on the `image_registry` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Made the column `path` on table `image_registry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "image_registry" DROP COLUMN "file",
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "path" SET NOT NULL;
