/*
  Warnings:

  - You are about to drop the column `entry_amount` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `max_rounds` on the `leagues` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leagues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "gameWeekNo" INTEGER NOT NULL DEFAULT 1,
    "gameWeekDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,
    CONSTRAINT "leagues_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_leagues" ("code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id", "usersId") SELECT "code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id", "usersId" FROM "leagues";
DROP TABLE "leagues";
ALTER TABLE "new_leagues" RENAME TO "leagues";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_leagues_1" ON "leagues"("code");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
