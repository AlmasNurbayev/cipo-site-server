-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "qnt" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "discount" BOOLEAN NOT NULL,
    "discount_percent" DECIMAL(65,30),
    "price_final" DECIMAL(65,30) NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
