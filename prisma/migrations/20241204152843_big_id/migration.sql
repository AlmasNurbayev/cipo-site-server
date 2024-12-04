/*
  Warnings:

  - The primary key for the `qnt_price_registry` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "qnt_price_registry" DROP CONSTRAINT "qnt_price_registry_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "qnt_price_registry_pkey" PRIMARY KEY ("id");
