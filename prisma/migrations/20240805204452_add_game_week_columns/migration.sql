-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leagues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "entry_amount" INTEGER NOT NULL,
    "max_rounds" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "gameWeekNo" INTEGER NOT NULL DEFAULT 1,
    "gameWeekDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leagues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_leagues" ("code", "created_at", "entry_amount", "id", "max_rounds", "name", "user_id") SELECT "code", "created_at", "entry_amount", "id", "max_rounds", "name", "user_id" FROM "leagues";
DROP TABLE "leagues";
ALTER TABLE "new_leagues" RENAME TO "leagues";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_leagues_1" ON "leagues"("code");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
