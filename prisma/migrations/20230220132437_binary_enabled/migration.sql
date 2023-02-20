/*
  Warnings:

  - Added the required column `only_change` to the `registrator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registrator" ADD COLUMN     "only_change" BOOLEAN NOT NULL;
