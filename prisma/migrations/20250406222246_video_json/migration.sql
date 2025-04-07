/*
  Warnings:

  - You are about to alter the column `video` on the `Manutence` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `Manutence` MODIFY `video` JSON NOT NULL;
