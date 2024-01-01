/*
  Warnings:

  - You are about to alter the column `reason` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Session` MODIFY `reason` ENUM('Session_Token_Expired', 'Session_User_Logout') NULL;
