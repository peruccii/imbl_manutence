-- CreateTable
CREATE TABLE "HistoricoManutencao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "typeUser" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "manutenceId" TEXT NOT NULL,
    CONSTRAINT "HistoricoManutencao_manutenceId_fkey" FOREIGN KEY ("manutenceId") REFERENCES "Manutence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HistoricoManutencao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricoManutencao_id_key" ON "HistoricoManutencao"("id");
