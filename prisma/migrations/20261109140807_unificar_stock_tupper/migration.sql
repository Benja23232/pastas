/*
  Warnings:

  - You are about to drop the column `stockMinimo` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "stockMinimo",
ADD COLUMN     "numero" INTEGER;
