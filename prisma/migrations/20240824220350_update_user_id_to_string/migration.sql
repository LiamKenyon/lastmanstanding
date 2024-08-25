/*
  Warnings:

  - Made the column `user_id` on table `league_users` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_league_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "league_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "usersId" INTEGER,
    CONSTRAINT "league_users_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "league_users_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_league_users" ("id", "league_id", "user_id") SELECT "id", "league_id", "user_id" FROM "league_users";
DROP TABLE "league_users";
ALTER TABLE "new_league_users" RENAME TO "league_users";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_league_users_1" ON "league_users"("league_id", "user_id");
Pragma writable_schema=0;
CREATE TABLE "new_leagues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "entry_amount" INTEGER NOT NULL,
    "max_rounds" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "gameWeekNo" INTEGER NOT NULL DEFAULT 1,
    "gameWeekDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,
    CONSTRAINT "leagues_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_leagues" ("code", "created_at", "entry_amount", "gameWeekDate", "gameWeekNo", "id", "max_rounds", "name", "user_id") SELECT "code", "created_at", "entry_amount", "gameWeekDate", "gameWeekNo", "id", "max_rounds", "name", "user_id" FROM "leagues";
DROP TABLE "leagues";
ALTER TABLE "new_leagues" RENAME TO "leagues";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_leagues_1" ON "leagues"("code");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
