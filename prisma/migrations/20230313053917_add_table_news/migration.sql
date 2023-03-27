-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "title" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "changed_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);
