-- DropForeignKey
ALTER TABLE `HistoricoManutencao` DROP FOREIGN KEY `HistoricoManutencao_manutenceId_fkey`;

-- DropIndex
DROP INDEX `HistoricoManutencao_manutenceId_fkey` ON `HistoricoManutencao`;

-- AlterTable
ALTER TABLE `HistoricoManutencao` MODIFY `manutenceId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `HistoricoManutencao` ADD CONSTRAINT `HistoricoManutencao_manutenceId_fkey` FOREIGN KEY (`manutenceId`) REFERENCES `Manutence`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
