/*
  Warnings:

  - Added the required column `packageType` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderhistory` ADD COLUMN `packagePricingGId` VARCHAR(191) NULL,
    ADD COLUMN `packagePricingPId` VARCHAR(191) NULL,
    ADD COLUMN `packageType` ENUM('G', 'P') NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_packagePricingGId_fkey` FOREIGN KEY (`packagePricingGId`) REFERENCES `PackagePricingG`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_packagePricingPId_fkey` FOREIGN KEY (`packagePricingPId`) REFERENCES `PackagePricingP`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
