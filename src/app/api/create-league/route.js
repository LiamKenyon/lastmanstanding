import { createClient } from "../../../../utils/supabase/server.js";
import { getUniqueLeagueId } from "../../../../lib/utils";

export async function POST(req) {
  const supabase = createClient();
  console.log("Supabase client created");

  // Get the authenticated user from Supabase
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Check if there's an error retrieving the user
  if (userError) {
    console.error("Error getting user:", userError.message);
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  console.log("User ID:", user.id);

  const formData = await req.json();

  // Check if the user object is present
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const code = await getUniqueLeagueId();
    console.log("League Data:", formData.leagueName, code, user.id);
    console.log("user id", user.id);
    // Create the league
    const { data: createdLeague, error: leagueError } = await supabase
      .from("leagues")
      .insert({
        name: formData.leagueName,
        code: code,
        user_id: user.id, // Use user.id directly
      })
      .select();
    // Check if there was an error while creating the league
    if (leagueError) {
      throw new Error(leagueError.message);
    }

    // Associate the user with the league
    const { error: userLeagueError } = await supabase.from("league_users").insert({
      user_id: user.id, // Use user.id directly
      league_id: createdLeague[0].id, // Correctly access createdLeague.id
    });

    // Check if there was an error while associating the user with the league
    if (userLeagueError) {
      throw new Error(userLeagueError.message);
    }

    return new Response(JSON.stringify({ message: "League created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create league" }), {
      status: 500,
    });
  }
}
