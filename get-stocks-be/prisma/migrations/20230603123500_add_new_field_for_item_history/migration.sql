/*
  Warnings:

  - Added the required column `extension` to the `ItemHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `ItemHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemId` to the `ItemHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itemhistory` ADD COLUMN `extension` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileName` VARCHAR(191) NOT NULL,
    ADD COLUMN `systemId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ItemHistory` ADD CONSTRAINT `ItemHistory_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `System`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
