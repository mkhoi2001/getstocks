/*
  Warnings:

  - You are about to drop the column `content` on the `stocktype` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `packagepricingg` ADD COLUMN `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `packagepricingp` ADD COLUMN `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stocktype` DROP COLUMN `content`;
