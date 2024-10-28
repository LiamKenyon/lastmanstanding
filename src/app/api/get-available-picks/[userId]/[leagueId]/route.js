import { createClient } from "../../../../../../utils/supabase/server.js";
import { SupabaseClient } from "../../../../../../lib/supabaseClient.ts";

export async function GET(req, { params }) {
  const supabase = createClient();
  const supabaseClient = new SupabaseClient();

  const { userId, leagueId } = params;

  // Check if the user is authenticated
  const userData = await supabaseClient.getAuthenticatedUser();
  if (!userData) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  // Fetch all possible picks, user picks, and league user data
  const [availablePicks, userPicks, leagueUser] = await Promise.all([
    supabaseClient.getPickableGames(),
    supabaseClient.getUserPicks(userId, parseInt(leagueId)),
    supabaseClient.getLeagueUserData(userId, parseInt(leagueId)),
  ]);

  // Filter available picks by excluding teams already picked by the user
  const filteredAvailablePicks = availablePicks.filter(
    (pick) => !userPicks.some((userPick) => userPick.teamName === pick.team)
  );

  // Return response with relevant data
  return new Response(
    JSON.stringify({
      userId,
      leagueId,
      isEliminated: leagueUser.isEliminated,
      availablePicks: filteredAvailablePicks,
      gameWeeks: userPicks.length,
      winner: leagueUser.winner,
    }),
    { status: 200 }
  );
}
