-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "user_auth" BOOLEAN NOT NULL,
    "email_not_auth" TEXT,
    "phone_not_auth" TEXT,
    "name_not_auth" TEXT,
    "source" TEXT,
    "status" TEXT,
    "user_id" INTEGER,
    "create_date" TIMESTAMPTZ,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
