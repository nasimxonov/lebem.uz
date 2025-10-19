-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
