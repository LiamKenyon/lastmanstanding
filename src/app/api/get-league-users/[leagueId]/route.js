import { createClient } from "../../../../../utils/supabase/server.js";

export async function GET(req, { params }) {
  const { leagueId } = params;
  const supabase = createClient();

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

  // Fetch the league users (user_id and isEliminated)
  const { data: leagueUsers, error: leagueUsersError } = await supabase
    .from("league_users")
    .select("user_id, isEliminated")
    .eq("league_id", parseInt(leagueId));

  if (leagueUsersError) {
    return new Response(
      JSON.stringify({ message: "Error fetching league users", error: leagueUsersError.message }),
      { status: 500 }
    );
  }

  const userIds = leagueUsers.map((leagueUser) => leagueUser.user_id);

  // Fetch the user names based on the user IDs
  const { data: userNames, error: userNamesError } = await supabase
    .from("profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  if (userNamesError) {
    console.log(userNamesError);
    return new Response(
      JSON.stringify({ message: "Error fetching user names", error: userNamesError.message }),
      { status: 500 }
    );
  }

  // Merge isEliminated field with the corresponding user details
  const result = leagueUsers.map((leagueUser) => {
    const userProfile = userNames.find((user) => user.user_id === leagueUser.user_id);
    return {
      user_id: leagueUser.user_id,
      display_name: userProfile?.display_name || null, // Handle case where profile not found
      isEliminated: leagueUser.isEliminated,
    };
  });

  // Return the merged result
  return new Response(JSON.stringify(result), { status: 200 });
}
