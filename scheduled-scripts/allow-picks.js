const prisma = require("../lib/prisma");

const cron = require("node-cron");

// Do this every 20 seconds
// Query leagues, get ids of leagues that isActive is true
// Query all the users of this league and set can pick to true if isEliminated is false

cron.schedule("*/20 * * * * *", async () => {
  const leagues = await prisma.leagues.findMany({
    where: {
      isActive: true,
    },
  });

  leagues.forEach(async (league) => {
    const users = await prisma.league_users.findMany({
      where: {
        league_id: league.id,
      },
    });

    users.forEach(async (user) => {
      if (!user.isEliminated) {
        await prisma.league_users.update({
          where: {
            id: user.id,
          },
          data: {
            canPick: true,
          },
        });
      }
    });
  });
  console.log("done");
});
