/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `PackagePricingG` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content]` on the table `PackagePricingP` will be added. If there are existing duplicate values, this will fail.
  - Made the column `content` on table `packagepricingg` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `packagepricingp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `packagepricingg` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `packagepricingp` MODIFY `content` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PackagePricingG_content_key` ON `PackagePricingG`(`content`);

-- CreateIndex
CREATE UNIQUE INDEX `PackagePricingP_content_key` ON `PackagePricingP`(`content`);
