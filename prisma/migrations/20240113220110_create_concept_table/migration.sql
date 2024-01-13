-- CreateTable
CREATE TABLE `Concept` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('Concept_Income', 'Concept_Expense') NOT NULL,
    `concept` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Concept_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Concept` ADD CONSTRAINT `Concept_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
