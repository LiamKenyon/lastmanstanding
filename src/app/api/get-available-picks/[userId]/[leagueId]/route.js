import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getPickableGames } from "../../../../../../scripts/getPickableGames";

export async function GET(req, { params }) {
  const availablePicks = await getPickableGames();

  const { userId, leagueId } = params;

  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Get the user's picks for the current league
  const picks = await prisma.picks.findMany({
    where: {
      user_id: userId,
      league_id: parseInt(leagueId),
    },
    select: {
      teamName: true,
    },
  });

  // Extract team names from the user's picks
  const teamNames = picks.map((pick) => pick.teamName);

  // Filter out objects where team is in the user's picks
  const filteredAvailablePicks = availablePicks.filter(
    (pickable) => !teamNames.includes(pickable.team)
  );

  // Return the filtered available picks with date information
  return new Response(
    JSON.stringify({ userId, leagueId, availablePicks: filteredAvailablePicks }),
    {
      status: 200,
    }
  );
}
