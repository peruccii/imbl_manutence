-- AlterTable
ALTER TABLE `Manutence` MODIFY `status_manutence` ENUM('FINALIZADO', 'ANDAMENTO', 'CANCELADO', 'NOVO') NOT NULL DEFAULT 'NOVO';
