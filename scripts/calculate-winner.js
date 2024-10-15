import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function markLastUserAsWinner() {
  // Query all active leagues
  const { data: leagues, error: leaguesError } = await supabase.from("leagues").select("*"); // Selects all columns

  if (leaguesError) {
    console.error("Error fetching leagues:", leaguesError.message);
  } else {
    console.log("Leagues data:", leagues);
  }
}

markLastUserAsWinner();
