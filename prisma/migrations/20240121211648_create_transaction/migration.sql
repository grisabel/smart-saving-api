/*
  Warnings:

  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Income` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_conceptId_fkey`;

-- DropForeignKey
ALTER TABLE `Income` DROP FOREIGN KEY `Income_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `Income` DROP FOREIGN KEY `Income_conceptId_fkey`;

-- DropTable
DROP TABLE `Expense`;

-- DropTable
DROP TABLE `Income`;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('Transaction_Income', 'Transaction_Expense') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `conceptId` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_conceptId_fkey` FOREIGN KEY (`conceptId`) REFERENCES `Concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `FinancialAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
