/*
  Warnings:

  - You are about to alter the column `sum` on the `qnt_price_registry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `qnt` on the `qnt_price_registry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "qnt_price_registry" ALTER COLUMN "sum" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "qnt" SET DATA TYPE DOUBLE PRECISION;
