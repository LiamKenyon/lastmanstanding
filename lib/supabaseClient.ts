import { createClient, SupabaseClient as OriginalSupabaseClient } from "../utils/supabase/server.js";
import { getUniqueLeagueId } from "../lib/utils.js";

export class SupabaseClient {
  private client: OriginalSupabaseClient;

  constructor() {
    this.client = createClient();
  }

  // Check user is authenticated
  async getAuthenticatedUser(): Promise<any> {
    const { data, error: authError } = await this.client.auth.getUser();

    if (authError) throw new Error("Error fetching authenticated user");
    return data?.user ?? null;
  }

  // Fetch all user leagues
  async getUserLeagues(userId: string): Promise<any> {
    const { data: leagues, error } = await this.client
      .from("league_users")
      .select(`leagues (*), isEliminated, canPick, winner`)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return leagues;
  }

  // Create a league
  async createLeague(name: string, userId: string): Promise<any> {
    const code = await getUniqueLeagueId();

    const { data: createdLeague, error: leagueError } = await this.client
      .from("leagues")
      .insert({
        name: name,
        code: code,
        user_id: userId,
      })
      .select();

    if (leagueError) {
      throw new Error(`Error creating league: ${leagueError.message}`);
    }

    const { error: userLeagueError } = await this.client.from("league_users").insert({
      user_id: userId,
      league_id: createdLeague[0].id,
    });

    if (userLeagueError) {
      throw new Error(`Error associating user with league: ${userLeagueError.message}`);
    }

    return createdLeague[0];
  }

  // Get league users
  async getLeagueUsers(leagueId: string): Promise<any> {
    const { data: leagueUsers, error: leagueUsersError } = await this.client
      .from("league_users")
      .select("user_id, isEliminated")
      .eq("league_id", parseInt(leagueId));

    if (leagueUsersError) {
      throw new Error(`Error fetching league users: ${leagueUsersError.message}`);
    }

    return leagueUsers;
  }

  // Get user display names based on ids
  async getUserDisplayNames(userIds: string[]): Promise<any> {
    const { data: users, error: usersError } = await this.client
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    if (usersError) {
      throw new Error(`Error fetching user display names: ${usersError.message}`);
    }

    return users;
  }
}
