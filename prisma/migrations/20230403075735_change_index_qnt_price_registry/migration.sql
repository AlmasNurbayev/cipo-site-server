-- DropIndex
DROP INDEX "qnt_price_registry_registrator_id_idx";

-- CreateIndex
CREATE INDEX "qnt_price_registry_registrator_id_qnt_sum_product_id_idx" ON "qnt_price_registry"("registrator_id", "qnt", "sum", "product_id");
