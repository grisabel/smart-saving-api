/*
  Warnings:

  - The primary key for the `RevokeAccessToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `RevokeAccessToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[token]` on the table `RevokeAccessToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `RevokeAccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RevokeAccessToken` DROP PRIMARY KEY,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `RevokeAccessToken_token_key` ON `RevokeAccessToken`(`token`);
