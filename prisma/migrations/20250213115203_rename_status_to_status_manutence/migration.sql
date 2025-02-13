/*
  Warnings:

  - You are about to drop the column `status` on the `Manutence` table. All the data in the column will be lost.
  - Added the required column `status_manutence` to the `Manutence` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Manutence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "photos" JSONB NOT NULL,
    "video" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status_manutence" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Manutence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Manutence" ("createdAt", "id", "message", "photos", "userId", "video") SELECT "createdAt", "id", "message", "photos", "userId", "video" FROM "Manutence";
DROP TABLE "Manutence";
ALTER TABLE "new_Manutence" RENAME TO "Manutence";
CREATE UNIQUE INDEX "Manutence_id_key" ON "Manutence"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
