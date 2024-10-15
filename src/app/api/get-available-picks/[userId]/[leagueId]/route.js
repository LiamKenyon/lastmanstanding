import { createClient } from "../../../../../../utils/supabase/server.js";
import { getPickableGames } from "../../../../../../scripts/getPickableGames";

export async function GET(req, { params }) {
  const supabase = createClient();

  // Fetch pickable games (this remains unchanged)
  const availablePicks = await getPickableGames();

  // Extract userId and leagueId from route parameters
  const { userId, leagueId } = params;

  // Get the authenticated user from Supabase
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // If there is an error or the user is not authenticated
  if (userError || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Fetch the user's picks for the specified league from the Supabase database
  const { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("teamName") // Selecting only the teamName field
    .eq("user_id", userId) // Filtering by user_id
    .eq("league_id", parseInt(leagueId)); // Filtering by league_id

  // Handle any error when fetching picks
  if (picksError) {
    console.error("Error fetching picks:", picksError.message);
    return new Response(JSON.stringify({ message: "Failed to fetch picks" }), {
      status: 500,
    });
  }

  // Fetch the `isEliminated` status from the league_users table
  const { data: leagueUser, error: leagueUserError } = await supabase
    .from("league_users")
    .select("isEliminated, winner")
    .eq("user_id", userId) // Filtering by user_id
    .eq("league_id", parseInt(leagueId)) // Filtering by league_id
    .single(); // Ensure that we only fetch one row

  // Handle any error when fetching the `isEliminated` status
  if (leagueUserError) {
    console.error("Error fetching league user data:", leagueUserError.message);
    return new Response(JSON.stringify({ message: "Failed to fetch league user data" }), {
      status: 500,
    });
  }

  // Extract team names from the user's picks
  const teamNames = picks.map((pick) => pick.teamName);

  // Filter out objects where the team is already picked by the user
  const filteredAvailablePicks = availablePicks.filter(
    (pickable) => !teamNames.includes(pickable.team)
  );

  // Calculate the number of game weeks (length of picks)
  const gameWeeks = picks.length;

  // Return the filtered available picks along with userId, leagueId, isEliminated status, and gameWeeks
  return new Response(
    JSON.stringify({
      userId,
      leagueId,
      isEliminated: leagueUser.isEliminated, // Return the isEliminated status
      availablePicks: filteredAvailablePicks,
      gameWeeks, // Add gameWeeks as the length of picks
      winner: leagueUser.winner,
    }),
    {
      status: 200,
    }
  );
}
