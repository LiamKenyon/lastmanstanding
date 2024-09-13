-- CreateTable
CREATE TABLE "picks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    CONSTRAINT "picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "picks_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_league_team_pick" ON "picks"("user_id", "league_id", "teamName");
