-- CreateTable
CREATE TABLE `TokenList` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('REVOKE_ACCESS_TOKEN', 'LOGOUT_REFESH_TOKEN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
