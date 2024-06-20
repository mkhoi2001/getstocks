-- CreateTable
CREATE TABLE `PackageOrder` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `packagePricingPId` VARCHAR(191) NOT NULL,
    `expireTime` DATETIME(3) NOT NULL,
    `dailyLeft` INTEGER NOT NULL,

    UNIQUE INDEX `PackageOrder_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackagePricingG` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `balanceG` INTEGER NOT NULL,
    `balanceP` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackagePricingP` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `dayExpires` INTEGER NOT NULL,
    `downPerDay` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackageOrder` ADD CONSTRAINT `PackageOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageOrder` ADD CONSTRAINT `PackageOrder_packagePricingPId_fkey` FOREIGN KEY (`packagePricingPId`) REFERENCES `PackagePricingP`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
