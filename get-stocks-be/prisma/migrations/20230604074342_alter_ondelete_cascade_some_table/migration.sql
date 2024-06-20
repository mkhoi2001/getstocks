-- DropForeignKey
ALTER TABLE `stocktype` DROP FOREIGN KEY `StockType_stockId_fkey`;

-- DropForeignKey
ALTER TABLE `systemproperty` DROP FOREIGN KEY `SystemProperty_systemId_fkey`;

-- AddForeignKey
ALTER TABLE `StockType` ADD CONSTRAINT `StockType_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemProperty` ADD CONSTRAINT `SystemProperty_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `System`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
