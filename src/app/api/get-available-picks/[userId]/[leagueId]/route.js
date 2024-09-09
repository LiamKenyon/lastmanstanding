import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { generateFormattedDatesUntilSunday } from "../../../../../../lib/utils";
import { getPickableGames } from "../../../../../../scripts/getPickableGames";

export async function GET(req, { params }) {
  const availablePicks = await getPickableGames();
  const { userId, leagueId } = params;

  console.log(availablePicks);

  return new Response(JSON.stringify({ userId, leagueId, availablePicks }), {
    status: 200,
  });
}
