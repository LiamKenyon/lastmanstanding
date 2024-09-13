-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_picks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "league_id" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "usersId" INTEGER,
    CONSTRAINT "picks_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "picks_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_picks" ("id", "league_id", "teamName", "user_id") SELECT "id", "league_id", "teamName", "user_id" FROM "picks";
DROP TABLE "picks";
ALTER TABLE "new_picks" RENAME TO "picks";
CREATE UNIQUE INDEX "unique_user_league_team_pick" ON "picks"("user_id", "league_id", "teamName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
