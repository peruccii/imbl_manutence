-- Adiciona campos para melhor controle de mensagens não lidas
ALTER TABLE `Message` ADD COLUMN `readBy` JSON;
ALTER TABLE `Message` ADD COLUMN `readAt` DATETIME(3);

-- Atualiza mensagens existentes para marcar como não lidas
UPDATE `Message` SET `isRead` = false WHERE `isRead` IS NULL;

-- Reseta contadores para recalcular
UPDATE `ChatRoom` SET `unreadCount` = 0;
