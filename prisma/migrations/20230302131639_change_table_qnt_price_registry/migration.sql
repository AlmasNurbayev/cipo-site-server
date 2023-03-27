/*
  Warnings:

  - Added the required column `size_name_1c` to the `qnt_price_registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qnt_price_registry" ADD COLUMN     "size_name_1c" TEXT NOT NULL;
