const prisma = require("../lib/prisma");
const { generateFormattedDatesUntilSunday } = require("../lib/utils");

async function getPickableGames() {
  const formattedDates = generateFormattedDatesUntilSunday().map(
    (dateObj) => dateObj.formatDateISO // Extract just the YYYY-MM-DD part of the ISO string
  );

  const endDate = formattedDates[formattedDates.length - 1]; // Last day of the week (e.g., Sunday)

  const games = await prisma.games.findMany({
    where: {
      date: {
        gte: new Date(), // Greater than or equal to current date
        lte: endDate, // Less than or equal to end date
      },
      eventProgress: "PreEvent",
    },
    orderBy: {
      date: "asc",
    },
  });

  // Extract and combine homeTeam and awayTeam into a single array
  const teamNames = games.flatMap((game) => [game.homeTeam, game.awayTeam]);

  // Return an array of unique team names (to avoid duplicates)
  const uniqueTeamNames = [...new Set(teamNames)];
  return uniqueTeamNames;
}

module.exports = { getPickableGames };
