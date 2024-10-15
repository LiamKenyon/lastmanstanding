import { createClient } from "../../../../utils/supabase/server.js";

export async function GET(req) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(); // Get the authenticated user from Supabase

  if (authError || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Fetch leagues the user is part of
    const { data: leagues, error } = await supabase
      .from("league_users")
      .select(
        `
      leagues (*),
      isEliminated,
      canPick,
      winner
      `
      )
      .eq("user_id", user.id);
    if (error) {
      throw new Error(error.message);
    }

    // Map the leagues to include both the league info and isEliminated field
    const leagueDetails = await Promise.all(
      leagues.map(async (leagueUser) => {
        const league = leagueUser.leagues;

        // Query to count the number of members in the current league
        const { count: membersCount, error: membersError } = await supabase
          .from("league_users")
          .select("id", { count: "exact" }) // Only count, no need to fetch data
          .eq("league_id", league.id);

        if (membersError) {
          throw new Error(membersError.message);
        }

        return {
          ...league, // Include all league fields
          isEliminated: leagueUser.isEliminated, // Add the isEliminated field
          canPick: leagueUser.canPick,
          winner: leagueUser.winner,
          members: membersCount,
        };
      })
    );

    return new Response(JSON.stringify(leagueDetails), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get leagues" }), {
      status: 500,
    });
  }
}
