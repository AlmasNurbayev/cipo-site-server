/*
  Warnings:

  - Added the required column `product_folder_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "product_folder_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "product_folder" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_folder_id_1c_key" ON "product_folder"("id_1c");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_folder_id_fkey" FOREIGN KEY ("product_folder_id") REFERENCES "product_folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_folder" ADD CONSTRAINT "product_folder_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
