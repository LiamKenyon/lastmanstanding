// Scrapes todays games to update the database with the latest scores
const { generateFormattedDatesUntilSunday } = require("../lib/utils");
const fetch = require("node-fetch");
const prisma = require("../lib/prisma");

async function scrapeTodaysScores() {
  let games = [];
  total = 0;
  const todayDate = generateFormattedDatesUntilSunday()[0].formatDateAPI;
  const requestUrl = `https://www.bbc.co.uk/wc-data/container/sport-data-scores-fixtures?selectedEndDate=${todayDate}&selectedStartDate=${todayDate}&todayDate=${todayDate}&urn=urn%3Abbc%3Asportsdata%3Afootball%3Atournament%3Apremier-league&useSdApi=false`;
  const response = await fetch(requestUrl);
  const data = await response.json();
  let path = data.eventGroups;
  for (let eventGroup of path) {
    path = eventGroup.secondaryGroups[0].events;
    for (let event of path) {
      total++;
      let game = {
        date: event.date.iso,
        homeTeam: event.home.fullName,
        homeScore: event.home.score ? parseInt(event.home.score) : 0,
        awayTeam: event.away.fullName,
        awayScore: event.away.score ? parseInt(event.away.score) : 0,
        eventProgress: event.status,
      };
      if (event.winner && event.winner == "draw") {
        game.homeOutcome = "draw";
        game.awayOutcome = "draw";
      } else if (event.winner && event.winner == "home") {
        game.homeOutcome = "win";
        game.awayOutcome = "loss";
      } else if (event.winner && event.winner == "away") {
        game.homeOutcome = "loss";
        game.awayOutcome = "win";
      } else {
        game.homeOutcome = "unknown";
        game.awayOutcome = "unknown";
      }
      games.push(game);
    }
  }
  if (games.length > 0) {
    console.log(games);
    await saveScoresToDatabase(games);
  }
}

async function saveScoresToDatabase(scores) {
  for (const score of scores) {
    await prisma.games.upsert({
      where: {
        date_homeTeam_awayTeam: {
          date: new Date(score.date),
          homeTeam: score.homeTeam,
          awayTeam: score.awayTeam,
        },
      },
      update: {
        homeScore: score.homeScore,
        homeOutcome: score.homeOutcome,
        awayScore: score.awayScore,
        awayOutcome: score.awayOutcome,
        eventProgress: score.eventProgress,
        updatedAt: new Date(),
      },
      create: {
        date: new Date(score.date),
        homeTeam: score.homeTeam,
        homeScore: score.homeScore,
        homeOutcome: score.homeOutcome,
        awayTeam: score.awayTeam,
        awayScore: score.awayScore,
        awayOutcome: score.awayOutcome,
        eventProgress: score.eventProgress,
      },
    });
  }
}

scrapeTodaysScores();
