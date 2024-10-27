import { SupabaseClient } from "../../../../../lib/supabaseClient.ts";

export async function GET(req, { params }) {
  const { leagueId } = params;

  const supabaseClient = new SupabaseClient();

  const userData = await supabaseClient.getAuthenticatedUser();
  if (!userData) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  // Fetch the league users and extract the user IDs
  const leagueUsers = await supabaseClient.getLeagueUsers(leagueId);
  const userIds = leagueUsers.map((leagueUser) => leagueUser.user_id);

  // Fetch the user names based on the user IDs
  const userNames = await supabaseClient.getUserDisplayNames(userIds);

  // Merge isEliminated field with the corresponding user details
  const result = leagueUsers.map((leagueUser) => {
    const userProfile = userNames.find((user) => user.user_id === leagueUser.user_id);
    return {
      user_id: leagueUser.user_id,
      display_name: userProfile?.display_name || null,
      isEliminated: leagueUser.isEliminated,
    };
  });

  // Return the merged result
  return new Response(JSON.stringify(result), { status: 200 });
}
