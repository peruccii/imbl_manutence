/*
  Warnings:

  - You are about to drop the column `lastMessageId` on the `ChatRoom` table. All the data in the column will be lost.
  - Made the column `manutencao` on table `HistoricoManutencao` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_lastMessageFor_fkey`;

-- DropIndex
DROP INDEX `ChatRoom_lastMessageId_key` ON `ChatRoom`;

-- AlterTable
ALTER TABLE `ChatRoom` DROP COLUMN `lastMessageId`;

-- AlterTable
ALTER TABLE `HistoricoManutencao` MODIFY `manutencao` JSON NOT NULL;
