/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `usersId` on the `league_users` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `picks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sqlite_autoindex_users_1";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "sessions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_league_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "league_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "isEliminated" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "league_users_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_league_users" ("id", "isEliminated", "league_id", "user_id") SELECT "id", "isEliminated", "league_id", "user_id" FROM "league_users";
DROP TABLE "league_users";
ALTER TABLE "new_league_users" RENAME TO "league_users";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_league_users_1" ON "league_users"("league_id", "user_id");
Pragma writable_schema=0;
CREATE TABLE "new_leagues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "gameWeekNo" INTEGER NOT NULL DEFAULT 1,
    "gameWeekDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_leagues" ("code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id") SELECT "code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id" FROM "leagues";
DROP TABLE "leagues";
ALTER TABLE "new_leagues" RENAME TO "leagues";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_leagues_1" ON "leagues"("code");
Pragma writable_schema=0;
CREATE TABLE "new_picks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "league_id" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    CONSTRAINT "picks_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_picks" ("id", "league_id", "teamName", "user_id") SELECT "id", "league_id", "teamName", "user_id" FROM "picks";
DROP TABLE "picks";
ALTER TABLE "new_picks" RENAME TO "picks";
CREATE UNIQUE INDEX "unique_user_league_team_pick" ON "picks"("user_id", "league_id", "teamName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
