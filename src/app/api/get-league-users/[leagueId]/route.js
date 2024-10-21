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

  const { data: leagueUsers, error: leagueUsersError } = await supabase
    .from("league_users")
    .select("user_id")
    .eq("league_id", parseInt(leagueId));

  if (leagueUsersError) {
    return new Response(
      JSON.stringify({ message: "Error fetching league users", error: leagueUsersError.message }),
      { status: 500 }
    );
  }

  const userIds = leagueUsers.map((leagueUser) => leagueUser.user_id);

  console.log(userIds);
  const { data: userNames, error: userNamesError } = await supabase
    .from("profiles") // Assuming the table is called 'authenticated'
    .select("user_id, display_name") // Selecting the user_id and display_name fields
    .in("user_id", userIds); // Filtering by the list of user_ids

  if (userNamesError) {
    console.log(userNamesError);
    return new Response(
      JSON.stringify({ message: "Error fetching user names", error: userNamesError.message }),
      { status: 500 }
    );
  }
  console.log(userNames);
  return new Response(JSON.stringify(userNames), { status: 200 });
}
