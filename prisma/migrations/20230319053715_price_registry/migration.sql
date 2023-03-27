-- DropForeignKey
ALTER TABLE "price_registry" DROP CONSTRAINT "price_registry_registrator_id_fkey";

-- AlterTable
ALTER TABLE "price_registry" ALTER COLUMN "registrator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "price_registry" ADD CONSTRAINT "price_registry_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
