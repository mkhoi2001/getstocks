/*
  Warnings:

  - You are about to drop the column `source` on the `stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `stock` DROP COLUMN `source`,
    ADD COLUMN `systemId` VARCHAR(191) NOT NULL DEFAULT '1ddb0c8a-f84d-448c-98f3-f06080047081';

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `System`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
