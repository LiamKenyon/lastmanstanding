import { createClient } from "@supabase/supabase-js";
import { generateFormattedDatesUntilSunday } from "../lib/utils.js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

// Manually match Premier League team names to image paths
const getTeamImage = (teamName) => {
  switch (teamName) {
    case "Arsenal":
      return "/team-images/arsenal.png";
    case "Aston Villa":
      return "/team-images/aston-villa.png";
    case "AFC Bournemouth":
      return "/team-images/afc-bournemouth.png";
    case "Brentford":
      return "/team-images/brentford.png";
    case "Brighton & Hove Albion":
      return "/team-images/brighton-&-hove-albion.png";
    case "Chelsea":
      return "/team-images/chelsea.png";
    case "Crystal Palace":
      return "/team-images/crystal-palace.png";
    case "Everton":
      return "/team-images/everton.png";
    case "Fulham":
      return "/team-images/fulham.png";
    case "Liverpool":
      return "/team-images/liverpool.png";
    case "Manchester City":
      return "/team-images/manchester-city.png";
    case "Manchester United":
      return "/team-images/manchester-united.png";
    case "Newcastle United":
      return "/team-images/newcastle-united.png";
    case "Nottingham Forest":
      return "/team-images/nottingham-forest.png";
    case "Tottenham Hotspur":
      return "/team-images/tottenham-hotspur.png";
    case "West Ham United":
      return "/team-images/west-ham-united.png";
    case "Wolverhampton Wanderers":
      return "/team-images/wolverhampton-wanderers.png";
    case "Ipswich Town":
      return "/team-images/ipswich.png";
    case "Southampton":
      return "/team-images/southampton.png";
    case "Leicester City":
      return "/team-images/leicester.png";
    default:
      return "/team-images/default.png";
  }
};

export async function getPickableGames() {
  const formattedDates = generateFormattedDatesUntilSunday().map(
    (dateObj) => dateObj.formatDateISO
  );

  const endDate = formattedDates[formattedDates.length - 2]; // Last day of the week (e.g., Sunday)
  const currentDate = new Date().toISOString().slice(0, 10); // Current date formatted as YYYY-MM-DD

  // Perform the query to get games that are "PreEvent" and within the date range
  const { data: games, error } = await supabase
    .from("games")
    .select("homeTeam, awayTeam, date, eventProgress")
    .gt("date", currentDate) // Greater than current date
    .lte("date", endDate) // Less than or equal to the end of the week
    .eq("eventProgress", "PreEvent")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching pickable games:", error);
    return [];
  }

  // Create an array of objects containing homeTeam, awayTeam, date, and team images
  const gameDetails = games.flatMap((game) => [
    {
      team: game.homeTeam,
      date: game.date,
      opponent: game.awayTeam,
      teamImg: getTeamImage(game.homeTeam), // Add home team image
    },
    {
      team: game.awayTeam,
      date: game.date,
      opponent: game.homeTeam,
      teamImg: getTeamImage(game.awayTeam), // Add away team image
    },
  ]);

  console.log(gameDetails);
  return gameDetails;
}

// Trigger the score scraping for testing
getPickableGames();
