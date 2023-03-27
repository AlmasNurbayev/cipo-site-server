-- AlterTable
ALTER TABLE "price_registry" ADD COLUMN     "discount_begin" TIMESTAMPTZ,
ADD COLUMN     "discount_end" TIMESTAMPTZ,
ADD COLUMN     "discount_percent" DECIMAL(65,30);
