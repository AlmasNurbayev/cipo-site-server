/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `image_registry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "image_registry_name_key" ON "image_registry"("name");
