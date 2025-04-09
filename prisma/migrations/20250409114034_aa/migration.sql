-- AddForeignKey
ALTER TABLE `HistoricoManutencao` ADD CONSTRAINT `HistoricoManutencao_manutenceId_fkey` FOREIGN KEY (`manutenceId`) REFERENCES `Manutence`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
