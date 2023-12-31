-- DropIndex
DROP INDEX `RevokeAccessToken_token_key` ON `RevokeAccessToken`;

-- AlterTable
ALTER TABLE `RevokeAccessToken` MODIFY `token` TEXT NOT NULL;
