/*
  Warnings:

  - Added the required column `product_name` to the `qnt_price_registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qnt_price_registry" ADD COLUMN     "product_name" TEXT NOT NULL;
