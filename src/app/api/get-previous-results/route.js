import { SupabaseClient } from "../../../../lib/supabaseClient.ts";
import { getTeamImage } from "../../../../lib/TeamImageMapping.ts";

export async function GET(req, { params }) {
  const supabaseClient = new SupabaseClient();

  const userData = await supabaseClient.getAuthenticatedUser();
  if (!userData) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const previousScores = await supabaseClient.getPreviousGames();
  const previousScoresWithImages = previousScores.map((score) => ({
    ...score,
    homeImg: getTeamImage(score.homeTeam),
    awayImg: getTeamImage(score.awayTeam),
  }));
  return new Response(JSON.stringify(previousScoresWithImages), { status: 200 });
}
