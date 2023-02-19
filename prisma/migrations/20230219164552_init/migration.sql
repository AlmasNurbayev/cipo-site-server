-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT,
    "role" TEXT NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_1c" TEXT,
    "artikul" TEXT NOT NULL,
    "product_group_id" INTEGER NOT NULL,
    "product_vid_id" INTEGER NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "brend_id" INTEGER,
    "country_id" INTEGER,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_group" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_vid" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_vid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_vid" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "active_change_date" TIMESTAMPTZ NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "price_vid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brend" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "brend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "id_1c" TEXT NOT NULL,
    "name_1c" TEXT NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "createDate" TIMESTAMPTZ NOT NULL,
    "changedDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_registry" (
    "id" SERIAL NOT NULL,
    "sum" DECIMAL(65,30) NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price_vid_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "price_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qnt_registry" (
    "id" SERIAL NOT NULL,
    "qnt" DECIMAL(65,30) NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "qnt_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_registry" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "active" BOOLEAN NOT NULL,
    "active_change_date" TIMESTAMPTZ NOT NULL,
    "product_id" INTEGER NOT NULL,
    "registrator_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "image_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrator" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "name_folder" TEXT NOT NULL,
    "name_file" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "registrator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_vid_id_fkey" FOREIGN KEY ("product_vid_id") REFERENCES "product_vid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brend_id_fkey" FOREIGN KEY ("brend_id") REFERENCES "brend"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_group" ADD CONSTRAINT "product_group_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_vid" ADD CONSTRAINT "product_vid_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "size" ADD CONSTRAINT "size_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_vid" ADD CONSTRAINT "price_vid_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brend" ADD CONSTRAINT "brend_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country" ADD CONSTRAINT "country_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_registry" ADD CONSTRAINT "price_registry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_registry" ADD CONSTRAINT "price_registry_price_vid_id_fkey" FOREIGN KEY ("price_vid_id") REFERENCES "price_vid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_registry" ADD CONSTRAINT "price_registry_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_registry" ADD CONSTRAINT "price_registry_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_registry" ADD CONSTRAINT "qnt_registry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_registry" ADD CONSTRAINT "qnt_registry_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnt_registry" ADD CONSTRAINT "qnt_registry_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_registry" ADD CONSTRAINT "image_registry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_registry" ADD CONSTRAINT "image_registry_registrator_id_fkey" FOREIGN KEY ("registrator_id") REFERENCES "registrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrator" ADD CONSTRAINT "registrator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
