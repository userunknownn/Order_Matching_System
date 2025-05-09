/*
  Warnings:

  - The values [PARTIAL] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Fee` DROP FOREIGN KEY `Fee_matchId_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_buyOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_sellOrderId_fkey`;

-- DropIndex
DROP INDEX `Fee_matchId_fkey` ON `Fee`;

-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL;

-- DropTable
DROP TABLE `Match`;

-- CreateTable
CREATE TABLE `OrderMatch` (
    `id` VARCHAR(191) NOT NULL,
    `buyOrderId` VARCHAR(191) NOT NULL,
    `sellOrderId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `volume` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderMatch` ADD CONSTRAINT `OrderMatch_buyOrderId_fkey` FOREIGN KEY (`buyOrderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderMatch` ADD CONSTRAINT `OrderMatch_sellOrderId_fkey` FOREIGN KEY (`sellOrderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `OrderMatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
