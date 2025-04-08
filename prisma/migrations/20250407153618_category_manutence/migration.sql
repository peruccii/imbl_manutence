/*
  Warnings:

  - Added the required column `category` to the `Manutence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Manutence` ADD COLUMN `category` ENUM('Vazamento', 'Problemas_Estruturais', 'Problemas_Eletricidade', 'Problemas_Acabamento', 'Problemas_Acessibilidade', 'Problemas_Impermeabilização') NOT NULL;
