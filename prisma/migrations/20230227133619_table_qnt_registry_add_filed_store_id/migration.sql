/*
  Warnings:

  - Added the required column `store_id` to the `qnt_registry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qnt_registry" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "qnt_registry" ADD CONSTRAINT "qnt_registry_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
