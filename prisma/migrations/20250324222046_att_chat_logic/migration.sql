/*
  Warnings:

  - You are about to drop the column `lastMessage` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `unread` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatRoomId]` on the table `Manutence` will be added. If there are existing duplicate values, this will fail.
  - Made the column `chatRoomId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_chatRoomId_fkey`;

-- DropIndex
DROP INDEX `Message_chatRoomId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `ChatRoom` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Manutence` ADD COLUMN `adminId` VARCHAR(191) NULL,
    ADD COLUMN `chatRoomId` VARCHAR(191) NULL,
    MODIFY `video` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `lastMessage`,
    DROP COLUMN `unread`,
    MODIFY `chatRoomId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Manutence_chatRoomId_key` ON `Manutence`(`chatRoomId`);

-- AddForeignKey
ALTER TABLE `Manutence` ADD CONSTRAINT `Manutence_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manutence` ADD CONSTRAINT `Manutence_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
