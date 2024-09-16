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
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_leagues" ("code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id") SELECT "code", "created_at", "gameWeekDate", "gameWeekNo", "id", "name", "user_id" FROM "leagues";
DROP TABLE "leagues";
ALTER TABLE "new_leagues" RENAME TO "leagues";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_leagues_1" ON "leagues"("code");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
