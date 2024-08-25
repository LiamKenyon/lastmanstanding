const fetch = require("node-fetch");
const prisma = require("../lib/prisma");

// Function to generate formatted dates for the next n days for the API
const generateFormattedDates = (n) => {
  const formattedDates = [];
  for (let i = 0; i < n; i++) {
    const date_ob = new Date();
    date_ob.setDate(date_ob.getDate() + i);
    const weekday = date_ob.toLocaleString("en-us", { weekday: "long" });
    let date = date_ob.getDate().toString();
    let month = (date_ob.getMonth() + 1).toString().padStart(2, "0");
    let year = date_ob.getFullYear();
    let monthName = date_ob.toLocaleString("default", { month: "long" });
    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formatDatePath = `${weekday}-${date}${nth(date)}-${monthName}`;
    const formatDateAPI = `${year}-${month}-${date}`;
    formattedDates.push({ formatDatePath, formatDateAPI });
  }
  return formattedDates;
};

async function scrapeScores() {
  let scores = [];
  try {
    const dates = generateFormattedDates(30);
    for (const date of dates) {
      const requestUrl = `https://push.api.bbci.co.uk/batch?t=%2Fdata%2Fbbc-morph-football-scores-match-list-data%2FendDate%2F${date.formatDateAPI}%2FstartDate%2F${date.formatDateAPI}%2FtodayDate%2F${date.formatDateAPI}%2Ftournament%2Ffull-priority-order%2Fversion%2F2.4.6?timeout=5`;
      const response = await fetch(requestUrl);
      const data = await response.json();
      const paths = data.payload[0].body.matchData;
      for (let path of paths) {
        if (path.tournamentMeta.tournamentSlug === "premier-league") {
          const events = path.tournamentDatesWithEvents[date.formatDatePath][0].events;
          for (let event of events) {
            const score = {
              date: event.startTime.split("T")[0],
              homeTeam: event.homeTeam.name.full,
              homeScore: event.homeTeam.scores.score ?? 0,
              homeOutcome: event.homeTeam.eventOutcome ?? "",
              awayTeam: event.awayTeam.name.full,
              awayScore: event.awayTeam.scores.score ?? 0,
              awayOutcome: event.awayTeam.eventOutcome ?? "",
              eventProgress: event.eventProgress.status,
            };
            console.log(score);
            scores.push(score);
          }
        }
      }
    }
    await saveScoresToDatabase(scores);
  } catch (error) {
    console.error(error);
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

scrapeScores();
