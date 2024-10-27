import { SupabaseClient } from "../../../../lib/supabaseClient.ts";

export async function POST(req) {
  const supabaseClient = new SupabaseClient();

  const userData = await supabaseClient.getAuthenticatedUser();
  if (!userData) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  const formData = await req.json();

  try {
    // Create a new league and associate the user with it
    const newLeague = await supabaseClient.createLeague(formData.leagueName, userData.id);
    return new Response(JSON.stringify(newLeague), { status: 201 });
  } catch (error) {
    console.error("Error creating league:", error.message);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
