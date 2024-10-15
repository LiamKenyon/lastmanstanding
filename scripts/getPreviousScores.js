import { createClient } from "@supabase/supabase-js";
import { generateFormattedDatesUntilPreviousSunday } from "../lib/utils.js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Function to manually match Premier League team names to image paths
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

export async function getPreviousScores() {
  const formattedDates = generateFormattedDatesUntilPreviousSunday().map(
    (dateObj) => dateObj.formatDateISO
  );

  const endDate = new Date().toISOString().slice(0, 10);
  const currentDate = formattedDates[formattedDates.length - 1];

  // Perform the query to get games that are "PostEvent" and within the date range
  const { data: games, error } = await supabase
    .from("games")
    .select("homeTeam, awayTeam, homeScore, awayScore, date, id")
    .gt("date", currentDate) // Greater than or equal to the current date
    .lte("date", endDate) // Less than or equal to the end of the week
    .eq("eventProgress", "PostEvent")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching previous scores:", error);
    return [];
  }

  // Create an array of objects containing homeTeam, awayTeam, homeScore, awayScore, date, and image paths
  const gameDetails = games.map((game) => ({
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
    date: game.date,
    id: game.id,
    homeImg: getTeamImage(game.homeTeam), // Get image path for home team
    awayImg: getTeamImage(game.awayTeam), // Get image path for away team
  }));

  console.log(gameDetails);
  return gameDetails;
}
