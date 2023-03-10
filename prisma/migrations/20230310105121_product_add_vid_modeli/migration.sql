/*
  Warnings:

  - You are about to drop the column `vid_modeli` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "vid_modeli",
ADD COLUMN     "vid_modeli_id" INTEGER;

-- CreateTable
CREATE TABLE "vid_modeli" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vid_modeli_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vid_modeli_id_1c_key" ON "vid_modeli"("id_1c");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_vid_modeli_id_fkey" FOREIGN KEY ("vid_modeli_id") REFERENCES "vid_modeli"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vid_modeli" ADD CONSTRAINT "vid_modeli_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
