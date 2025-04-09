/*
  Warnings:

  - Made the column `manutencao` on table `HistoricoManutencao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `HistoricoManutencao` MODIFY `manutencao` JSON NOT NULL;
