import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Generate a random alphanumeric league ID
export function generateLeagueId() {
  const length = 8;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let leagueId = "";
  for (let i = 0; i < length; i++) {
    leagueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return leagueId;
}

// Ensure the generated league ID is unique
export async function getUniqueLeagueId() {
  let leagueId = generateLeagueId();

  let { data: leagueIdExists } = await supabase.from("leagues").select("id").eq("code", leagueId).single();

  console.log("LEAGUE ID EXISTS", leagueIdExists);
  while (leagueIdExists) {
    leagueId = generateLeagueId();
    ({ data: leagueIdExists } = await supabase.from("leagues").select("id").eq("code", leagueId).single());
  }

  return leagueId;
}
