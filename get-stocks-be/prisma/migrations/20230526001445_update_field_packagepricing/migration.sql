/*
  Warnings:

  - You are about to drop the column `content` on the `packagepricingg` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `packagepricingp` table. All the data in the column will be lost.
  - Added the required column `name` to the `PackagePricingG` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PackagePricingP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `packagepricingg` DROP COLUMN `content`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `packagepricingp` DROP COLUMN `content`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
