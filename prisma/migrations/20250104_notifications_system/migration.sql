-- Cria tabela de notificações
CREATE TABLE `Notification` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('INFO', 'WARNING', 'SUCCESS', 'ERROR') NOT NULL DEFAULT 'INFO',
  `isRead` BOOLEAN NOT NULL DEFAULT false,
  `userId` VARCHAR(191) NOT NULL,
  `manutenceId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `readAt` DATETIME(3) NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adiciona indices
CREATE INDEX `Notification_userId_idx` ON `Notification`(`userId`);
CREATE INDEX `Notification_manutenceId_idx` ON `Notification`(`manutenceId`);
CREATE INDEX `Notification_isRead_idx` ON `Notification`(`isRead`);

-- Adiciona foreign keys
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_manutenceId_fkey` FOREIGN KEY (`manutenceId`) REFERENCES `Manutence`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
