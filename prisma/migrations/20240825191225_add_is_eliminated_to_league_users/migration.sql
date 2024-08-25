-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_league_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "league_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "usersId" INTEGER,
    "isEliminated" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "league_users_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "league_users_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_league_users" ("id", "league_id", "user_id", "usersId") SELECT "id", "league_id", "user_id", "usersId" FROM "league_users";
DROP TABLE "league_users";
ALTER TABLE "new_league_users" RENAME TO "league_users";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_league_users_1" ON "league_users"("league_id", "user_id");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
