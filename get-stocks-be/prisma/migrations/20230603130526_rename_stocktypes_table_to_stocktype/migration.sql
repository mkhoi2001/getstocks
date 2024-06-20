/*
  Warnings:

  - You are about to drop the `stocktypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `stocktypes` DROP FOREIGN KEY `StockTypes_stockId_fkey`;

-- DropTable
DROP TABLE `stocktypes`;

-- CreateTable
CREATE TABLE `StockType` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('G', 'P') NOT NULL DEFAULT 'G',
    `price` INTEGER NOT NULL DEFAULT 0,
    `stockId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StockType_stockId_type_key`(`stockId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockType` ADD CONSTRAINT `StockType_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
