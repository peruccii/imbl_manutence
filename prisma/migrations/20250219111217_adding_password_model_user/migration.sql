/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "password" TEXT NOT NULL,
    "typeUser" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "telephone", "typeUser") SELECT "createdAt", "email", "id", "name", "telephone", "typeUser" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
