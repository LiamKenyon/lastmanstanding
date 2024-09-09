const prisma = require("../lib/prisma");
const { generateFormattedDatesUntilSunday } = require("../lib/utils");

async function getPickableGames() {
  const formattedDates = generateFormattedDatesUntilSunday().map(
    (dateObj) => dateObj.formatDateISO // Extract just the YYYY-MM-DD part of the ISO string
  );

  const startDate = new Date(); // First day of the week (e.g., Monday)
  const endDate = formattedDates[formattedDates.length - 1]; // Last day of the week (e.g., Sunday)

  console.log("Start Date:", startDate, "End Date:", endDate);

  const games = await prisma.games.findMany({
    where: {
      date: {
        gte: new Date(), // Greater than or equal to start date
        lte: endDate, // Less than or equal to end date
      },
      eventProgress: "PreEvent",
    },
    orderBy: {
      date: "asc",
    },
  });

  return games;
}

module.exports = { getPickableGames };
