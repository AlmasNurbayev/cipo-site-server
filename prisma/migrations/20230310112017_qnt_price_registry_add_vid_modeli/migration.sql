-- AlterTable
ALTER TABLE "qnt_price_registry" ADD COLUMN     "vid_modeli_id" INTEGER;

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_vid_modeli_id_fkey" FOREIGN KEY ("vid_modeli_id") REFERENCES "vid_modeli"("id") ON DELETE SET NULL ON UPDATE CASCADE;
