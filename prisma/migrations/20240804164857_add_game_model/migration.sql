-- CreateTable
CREATE TABLE "games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "homeOutcome" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "awayOutcome" TEXT NOT NULL,
    "eventProgress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "games_date_homeTeam_awayTeam_key" ON "games"("date", "homeTeam", "awayTeam");
