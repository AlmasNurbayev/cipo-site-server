/*
  Warnings:

  - A unique constraint covering the columns `[id_1c]` on the table `brend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `price_vid` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `product_group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `product_vid` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `size` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_1c]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolution` to the `image_registry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_ed` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_schema` to the `registrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_catalog` to the `registrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_class` to the `registrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_catalog` to the `registrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_class` to the `registrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ver_schema` to the `registrator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image_registry" ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "resolution" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "base_ed" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "material_inside" TEXT,
ADD COLUMN     "material_podoshva" TEXT,
ADD COLUMN     "material_up" TEXT;

-- AlterTable
ALTER TABLE "registrator" ADD COLUMN     "date_schema" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "id_catalog" TEXT NOT NULL,
ADD COLUMN     "id_class" TEXT NOT NULL,
ADD COLUMN     "name_catalog" TEXT NOT NULL,
ADD COLUMN     "name_class" TEXT NOT NULL,
ADD COLUMN     "ver_schema" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_desc_mapping" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_desc_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_desc_mapping_id_1c_key" ON "product_desc_mapping"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "brend_id_1c_key" ON "brend"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "country_id_1c_key" ON "country"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "price_vid_id_1c_key" ON "price_vid"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_1c_key" ON "product"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "product_group_id_1c_key" ON "product_group"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "product_vid_id_1c_key" ON "product_vid"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "size_id_1c_key" ON "size"("id_1c");

-- CreateIndex
CREATE UNIQUE INDEX "store_id_1c_key" ON "store"("id_1c");

-- AddForeignKey
ALTER TABLE "product_desc_mapping" ADD CONSTRAINT "product_desc_mapping_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
