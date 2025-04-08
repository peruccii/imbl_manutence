-- DropForeignKey
ALTER TABLE `Manutence` DROP FOREIGN KEY `Manutence_userId_fkey`;

-- DropIndex
DROP INDEX `Manutence_userId_fkey` ON `Manutence`;

-- AddForeignKey
ALTER TABLE `Manutence` ADD CONSTRAINT `Manutence_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
