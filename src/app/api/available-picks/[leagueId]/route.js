import prisma from "../../../../../lib/prisma";
import utils from "../../../../../lib/utils";

// Function to fetch user ID from session cookie
async function getUserId(req) {
  const cookies = utils.parseCookies(req);
  return await utils.getUserIdFromSession(cookies.sessionId);
}

// Function to find if user is part of the league
async function getUserLeague(leagueId, userId) {
  return await prisma.league_users.findFirst({
    where: {
      league_id: leagueId,
      user_id: userId,
    },
  });
}

// Main GET handler
export async function GET(req, { params }) {
  try {
    // Extract leagueId from params
    const leagueId = Number(params.leagueId);
    if (!leagueId) {
      return new Response(JSON.stringify({ error: "League ID is required" }), { status: 400 });
    }

    // Fetch user ID from session
    const userId = await getUserId(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "User is not authenticated" }), { status: 401 });
    }

    // Check if user is part of the league
    const league = await getUserLeague(leagueId, userId);
    if (!league) {
      return new Response(JSON.stringify({ error: "User is not in the league" }), { status: 403 });
    }

    // Return the league details
    return new Response(JSON.stringify(league), { status: 200 });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
