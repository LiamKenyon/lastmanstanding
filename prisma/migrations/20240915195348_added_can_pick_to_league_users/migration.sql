-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_league_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "league_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "isEliminated" BOOLEAN NOT NULL DEFAULT false,
    "canPick" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "league_users_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_league_users" ("id", "isEliminated", "league_id", "user_id") SELECT "id", "isEliminated", "league_id", "user_id" FROM "league_users";
DROP TABLE "league_users";
ALTER TABLE "new_league_users" RENAME TO "league_users";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_league_users_1" ON "league_users"("league_id", "user_id");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
