/*
  Warnings:

  - Added the required column `changed_date` to the `subscribe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscribe" ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ;
