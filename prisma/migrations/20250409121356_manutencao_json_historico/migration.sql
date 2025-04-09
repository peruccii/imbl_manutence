/*
  Warnings:

  - You are about to drop the column `nomeManutencao` on the `HistoricoManutencao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HistoricoManutencao` DROP COLUMN `nomeManutencao`,
    ADD COLUMN `manutencao` JSON NULL;
