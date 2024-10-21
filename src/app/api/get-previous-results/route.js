import { createClient } from "../../../../utils/supabase/server.js";
import { getPreviousScores } from "../../../../scripts/getPreviousScores.js";

export async function GET(req, { params }) {
  const supabase = createClient();

  // Fetch previous scores
  const previousScores = await getPreviousScores();

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
  return new Response(JSON.stringify(previousScores), { status: 200 });
}
