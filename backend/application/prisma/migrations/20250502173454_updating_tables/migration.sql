/*
  Warnings:

  - You are about to alter the column `type` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `btcBalance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usdBalance` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `remainingAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `remainingAmount` DOUBLE NOT NULL,
    MODIFY `type` ENUM('BUY', 'SELL') NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'PARTIAL', 'COMPLETED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `btcBalance`,
    DROP COLUMN `email`,
    DROP COLUMN `usdBalance`,
    ADD COLUMN `btcAvailable` DOUBLE NOT NULL DEFAULT 100,
    ADD COLUMN `btcLocked` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `usdAvailable` DOUBLE NOT NULL DEFAULT 100000,
    ADD COLUMN `usdLocked` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Match` (
    `id` VARCHAR(191) NOT NULL,
    `buyOrderId` VARCHAR(191) NOT NULL,
    `sellOrderId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `volume` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fee` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `matchId` VARCHAR(191) NOT NULL,
    `role` ENUM('MAKER', 'TAKER') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_buyOrderId_fkey` FOREIGN KEY (`buyOrderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_sellOrderId_fkey` FOREIGN KEY (`sellOrderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
