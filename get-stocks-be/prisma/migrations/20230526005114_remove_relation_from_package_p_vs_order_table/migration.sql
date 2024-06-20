/*
  Warnings:

  - You are about to drop the column `packagePricingPId` on the `packageorder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `packageorder` DROP FOREIGN KEY `PackageOrder_packagePricingPId_fkey`;

-- AlterTable
ALTER TABLE `packageorder` DROP COLUMN `packagePricingPId`;
