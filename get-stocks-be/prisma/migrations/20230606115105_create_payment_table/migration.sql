/*
  Warnings:

  - You are about to drop the column `content` on the `bank` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `momo` table. All the data in the column will be lost.
  - Added the required column `host` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `host` to the `Momo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bank` DROP COLUMN `content`,
    ADD COLUMN `host` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `momo` DROP COLUMN `content`,
    ADD COLUMN `host` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `packageType` ENUM('G', 'P') NOT NULL DEFAULT 'G',
    `packageId` VARCHAR(191) NOT NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `bankId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `momoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `packagePricingGId` VARCHAR(191) NULL,
    `packagePricingPId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_packagePricingGId_fkey` FOREIGN KEY (`packagePricingGId`) REFERENCES `PackagePricingG`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_packagePricingPId_fkey` FOREIGN KEY (`packagePricingPId`) REFERENCES `PackagePricingP`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_momoId_fkey` FOREIGN KEY (`momoId`) REFERENCES `Momo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
