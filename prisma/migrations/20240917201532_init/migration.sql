-- CreateTable
CREATE TABLE "league_users" (
    "id" SERIAL NOT NULL,
    "league_id" INTEGER,
    "user_id" TEXT NOT NULL,
    "isEliminated" BOOLEAN NOT NULL DEFAULT false,
    "canPick" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "league_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "gameWeekNo" INTEGER NOT NULL DEFAULT 1,
    "gameWeekDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "homeOutcome" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "awayOutcome" TEXT NOT NULL,
    "eventProgress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picks" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "league_id" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "picks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "league_users_league_id_user_id_key" ON "league_users"("league_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_code_key" ON "leagues"("code");

-- CreateIndex
CREATE UNIQUE INDEX "games_date_homeTeam_awayTeam_key" ON "games"("date", "homeTeam", "awayTeam");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_league_team_pick" ON "picks"("user_id", "league_id", "teamName");

-- AddForeignKey
ALTER TABLE "league_users" ADD CONSTRAINT "league_users_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
