-- AlterTable
ALTER TABLE `itemhistory` ADD COLUMN `cost` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `orderhistory` ADD COLUMN `costPayment` DOUBLE NOT NULL DEFAULT 0;
