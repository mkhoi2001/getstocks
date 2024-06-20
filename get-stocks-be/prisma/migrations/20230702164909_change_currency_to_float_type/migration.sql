/*
  Warnings:

  - You are about to alter the column `balanceG` on the `packagepricingg` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `balanceP` on the `packagepricingg` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `packagepricingg` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `packagepricingp` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `stocktype` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `balanceG` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `balanceP` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `totalDeposit` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `packagepricingg` MODIFY `balanceG` DOUBLE NOT NULL,
    MODIFY `balanceP` DOUBLE NOT NULL,
    MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `packagepricingp` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `stocktype` MODIFY `price` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` MODIFY `balanceG` DOUBLE NULL DEFAULT 0,
    MODIFY `balanceP` DOUBLE NULL DEFAULT 0,
    MODIFY `totalDeposit` DOUBLE NULL DEFAULT 0;
