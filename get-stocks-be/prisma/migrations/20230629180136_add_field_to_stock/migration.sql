-- AlterTable
ALTER TABLE `stock` ADD COLUMN `pathName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `systemconfig` MODIFY `value` VARCHAR(350) NOT NULL;
