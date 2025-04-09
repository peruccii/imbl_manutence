-- DropForeignKey
ALTER TABLE `HistoricoManutencao` DROP FOREIGN KEY `HistoricoManutencao_manutenceId_fkey`;

-- DropIndex
DROP INDEX `HistoricoManutencao_manutenceId_fkey` ON `HistoricoManutencao`;
