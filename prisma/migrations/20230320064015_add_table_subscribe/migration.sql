-- CreateTable
CREATE TABLE "subscribe" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "news" BOOLEAN NOT NULL,
    "city" TEXT,
    "district" TEXT,

    CONSTRAINT "subscribe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribe_email_key" ON "subscribe"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscribe_phone_key" ON "subscribe"("phone");
