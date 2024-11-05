import { SupabaseClient } from "../../../../lib/supabaseClient.ts";

export async function GET(req) {
  const supabaseClient = new SupabaseClient();

  const userData = await supabaseClient.getAuthenticatedUser();
  if (!userData) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    // Fetch the users leagues
    const leagues = await supabaseClient.getUserLeagues(userData.id);
    return new Response(JSON.stringify(leagues), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get leagues" }), {
      status: 500,
    });
  }
}
