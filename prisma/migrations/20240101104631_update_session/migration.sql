/*
  Warnings:

  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `Session_userId_createdAt_idx` ON `Session`;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `userId`,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Session_userEmail_createdAt_idx` ON `Session`(`userEmail`, `createdAt`);

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
