/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Income` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_userEmail_fkey`;

-- DropForeignKey
ALTER TABLE `Income` DROP FOREIGN KEY `Income_userEmail_fkey`;

-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `userEmail`;

-- AlterTable
ALTER TABLE `Income` DROP COLUMN `userEmail`;
