/*
  Warnings:

  - A unique constraint covering the columns `[lastMessageId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ChatRoom` ADD COLUMN `lastMessageId` VARCHAR(191) NULL,
    ADD COLUMN `unreadCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `ChatRoom_lastMessageId_key` ON `ChatRoom`(`lastMessageId`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_lastMessageFor_fkey` FOREIGN KEY (`id`) REFERENCES `ChatRoom`(`lastMessageId`) ON DELETE RESTRICT ON UPDATE CASCADE;
