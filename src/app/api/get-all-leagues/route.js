import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req, res) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Fetch leagues the user is part of
    const leagues = await prisma.league_users.findMany({
      where: {
        user_id: session.user.sub,
      },
      include: {
        leagues: true, // Include the league details directly
      },
    });

    // Map the leagues to include both the league info and isEliminated field
    const leagueDetails = leagues.map((leagueUser) => ({
      ...leagueUser.leagues, // Include all league fields
      isEliminated: leagueUser.isEliminated, // Add the isEliminated field from league_users
    }));

    console.log(leagueDetails);
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
