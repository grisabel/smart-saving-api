-- CreateTable
CREATE TABLE `FinancialAccount` (
    `id` VARCHAR(191) NOT NULL,
    `accountNumber` INTEGER NOT NULL DEFAULT 0,
    `token` TEXT NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    INDEX `FinancialAccount_userEmail_accountNumber_idx`(`userEmail`, `accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinancialAccount` ADD CONSTRAINT `FinancialAccount_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
