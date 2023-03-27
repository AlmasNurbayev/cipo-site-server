/*
  Warnings:

  - You are about to alter the column `sum` on the `price_registry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `qnt` on the `qnt_registry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "price_registry" ALTER COLUMN "sum" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "qnt_registry" ALTER COLUMN "qnt" SET DATA TYPE DOUBLE PRECISION;
