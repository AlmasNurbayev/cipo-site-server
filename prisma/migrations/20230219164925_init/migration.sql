/*
  Warnings:

  - You are about to drop the column `changedDate` on the `brend` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `brend` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `country` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `country` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `price_vid` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `price_vid` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `product_group` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `product_group` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `product_vid` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `product_vid` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `changedDate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `user` table. All the data in the column will be lost.
  - Added the required column `changed_date` to the `brend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `brend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `price_vid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `price_vid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `product_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `product_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `product_vid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `product_vid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changed_date` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_date` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brend" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "country" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "price_vid" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "product_group" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "product_vid" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "size" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "store" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "changedDate",
DROP COLUMN "createDate",
ADD COLUMN     "changed_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "create_date" TIMESTAMPTZ NOT NULL;
