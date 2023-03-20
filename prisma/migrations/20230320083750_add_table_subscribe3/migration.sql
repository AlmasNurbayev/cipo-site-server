/*
  Warnings:

  - You are about to drop the column `news` on the `subscribe` table. All the data in the column will be lost.
  - Added the required column `agree` to the `subscribe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscribe" DROP COLUMN "news",
ADD COLUMN     "agree" BOOLEAN NOT NULL,
ADD COLUMN     "wish" TEXT;
