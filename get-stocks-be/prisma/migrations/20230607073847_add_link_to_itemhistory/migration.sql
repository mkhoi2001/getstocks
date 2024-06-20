/*
  Warnings:

  - Added the required column `link` to the `ItemHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itemhistory` ADD COLUMN `link` VARCHAR(191) NOT NULL;
