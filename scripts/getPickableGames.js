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

  // Create an array of objects containing homeTeam and date, and awayTeam and date
  const gameDetails = games.flatMap((game) => [
    { team: game.homeTeam, date: game.date },
    { team: game.awayTeam, date: game.date },
  ]);

  return gameDetails;
}

module.exports = { getPickableGames };
