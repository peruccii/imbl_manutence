/*
  Warnings:

  - You are about to alter the column `video` on the `Manutence` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - Added the required column `lastMessage` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unread` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Manutence` MODIFY `video` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `lastMessage` VARCHAR(191) NOT NULL,
    ADD COLUMN `unread` INTEGER NOT NULL;
