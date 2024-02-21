-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_conceptId_fkey`;

-- CreateTable
CREATE TABLE `Habits` (
    `id` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `type` ENUM('Habits_Alimentation', 'Habits_Vehicles', 'Habits_Restaurant', 'Habits_AntExpenses') NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Habits_transactionId_key`(`transactionId`),
    INDEX `Habits_userEmail_type_idx`(`userEmail`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_conceptId_fkey` FOREIGN KEY (`conceptId`) REFERENCES `Concept`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Habits` ADD CONSTRAINT `Habits_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Habits` ADD CONSTRAINT `Habits_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
