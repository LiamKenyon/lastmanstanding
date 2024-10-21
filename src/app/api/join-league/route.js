import { createClient } from "../../../../utils/supabase/server.js";

export async function POST(req) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const formData = await req.json();

  if (userError) {
    console.error("Error getting user:", userError.message);
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Find the league with the given code
    const { data: league, error: leagueError } = await supabase
      .from("leagues")
      .select("id")
      .eq("code", formData.leagueCode)
      .single(); // Use single() to fetch one league

    if (leagueError) {
      throw new Error(leagueError.message);
    }

    if (league) {
      // Add the user to the league
      const { error: joinError } = await supabase.from("league_users").insert({
        user_id: user.id,
        league_id: league.id,
      });

      if (joinError) {
        throw new Error(joinError.message);
      }
    }

    return new Response(JSON.stringify({ message: "League found" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to join league" }), {
      status: 500,
    });
  }
}
