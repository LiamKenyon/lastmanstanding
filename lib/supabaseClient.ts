import { createClient, SupabaseClient as OriginalSupabaseClient } from "../utils/supabase/server.js";
import { getUniqueLeagueId } from "../lib/utils.js";
import { DateHandler } from "./dateHandler.ts";

export class SupabaseClient {
  private client: OriginalSupabaseClient;

  constructor() {
    this.client = createClient();
  }

  /**
   *
   * @returns {Promise<any>} - The authenticated user
   */
  async getAuthenticatedUser(): Promise<any> {
    const { data, error: authError } = await this.client.auth.getUser();

    if (authError) throw new Error("Error fetching authenticated user");
    return data?.user ?? null;
  }

  /**
   *
   * @param userId
   * @returns {Promise<any>} - All leagues the user is in
   */
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

  /**
   *
   * @param name
   * @param userId
   * @returns {Promise<any>} - The created league
   */
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

  /**
   *
   * @param leagueId
   * @returns {Promise<any>} - All the users in the league
   */
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

  /**
   *
   * @param userIds
   * @returns {Promise<any>} - The display names of the users passed in
   */
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

  /**
   *
   * @returns {Promise<any>} - All the teams pickable for the current week
   */
  async getPickableGames(): Promise<any> {
    const dates = DateHandler.generateDatesUntilSunday();

    const { data: games, error: picksError } = await this.client
      .from("games")
      .select("homeTeam, awayTeam, date, eventProgress")
      .gt("date", dates[0])
      .lte("date", dates[dates.length - 1])
      .order("date", { ascending: true });

    if (picksError) {
      throw new Error(`Error fetching pickable games: ${error.message}`);
    }

    const gameDetails = games.flatMap((game) => [
      {
        team: game.homeTeam,
        date: game.date,
        opponent: game.awayTeam,
      },
      {
        team: game.awayTeam,
        date: game.date,
        opponent: game.homeTeam,
      },
    ]);

    return gameDetails;
  }

  /**
   *
   * @param userId
   * @param leagueId
   * @returns {Promise<any>} - Picks the user has already made in the league
   */
  async getUserPicks(userId: string, leagueId: number): Promise<any> {
    const { data: picks, error: picksError } = await this.client
      .from("picks")
      .select("teamName")
      .eq("user_id", userId)
      .eq("league_id", leagueId);

    if (picksError) {
      throw new Error(`Error fetching picks: ${picksError.message}`);
    }

    return picks;
  }

/**
   *
   * @param userId
   * @param leagueId
   * @returns {Promise<any>} - Information about the user in the league
   */
  async getLeagueUserData(userId: string, leagueId: number): Promise<any> {
    const { data: leagueUserData, error: leagueUserDataError } = await this.client
      .from("league_users")
      .select("isEliminated, winner")
      .eq("user_id", userId)
      .eq("league_id", leagueId)
      .single();

    if (leagueUserDataError) {
      throw new Error(`Error fetching league user data: ${leagueUserDataError.message}`);
    }

    return leagueUserData;
  }
}
