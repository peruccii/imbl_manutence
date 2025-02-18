/*
  Warnings:

  - You are about to drop the column `typeUser` on the `HistoricoManutencao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricoManutencao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "manutenceId" TEXT NOT NULL,
    CONSTRAINT "HistoricoManutencao_manutenceId_fkey" FOREIGN KEY ("manutenceId") REFERENCES "Manutence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HistoricoManutencao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HistoricoManutencao" ("action", "data", "id", "manutenceId", "usuarioId") SELECT "action", "data", "id", "manutenceId", "usuarioId" FROM "HistoricoManutencao";
DROP TABLE "HistoricoManutencao";
ALTER TABLE "new_HistoricoManutencao" RENAME TO "HistoricoManutencao";
CREATE UNIQUE INDEX "HistoricoManutencao_id_key" ON "HistoricoManutencao"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
