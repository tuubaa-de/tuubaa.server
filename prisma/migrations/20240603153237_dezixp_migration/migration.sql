/*
  Warnings:

  - You are about to drop the column `xp` on the `Level` table. All the data in the column will be lost.
  - Added the required column `dezixp` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Level" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "dezixp" INTEGER NOT NULL
);
INSERT INTO "new_Level" ("userId") SELECT "userId" FROM "Level";
DROP TABLE "Level";
ALTER TABLE "new_Level" RENAME TO "Level";
CREATE UNIQUE INDEX "Level_userId_key" ON "Level"("userId");
PRAGMA foreign_key_check("Level");
PRAGMA foreign_keys=ON;
