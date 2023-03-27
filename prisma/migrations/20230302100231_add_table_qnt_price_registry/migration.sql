-- CreateTable
CREATE TABLE "qnt_price_registry" (
    "id" SERIAL NOT NULL,
    "sum" DECIMAL(65,30) NOT NULL,
    "qnt" INTEGER NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "discount_percent" DECIMAL(65,30),
    "discount_begin" TIMESTAMPTZ,
    "discount_end" TIMESTAMPTZ,
    "store_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price_vid_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "qnt_price_registry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_price_vid_id_fkey" FOREIGN KEY ("price_vid_id") REFERENCES "price_vid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_price_registry" ADD CONSTRAINT "qnt_price_registry_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
