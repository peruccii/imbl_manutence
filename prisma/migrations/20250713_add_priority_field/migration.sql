-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- AlterTable
ALTER TABLE `Manutence` ADD COLUMN `priority` ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') NULL DEFAULT 'MEDIA';
