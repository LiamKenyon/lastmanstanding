import prisma from "../../../../lib/prisma";
import { getUniqueLeagueId } from "../../../../lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const formData = await req.json();
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  // Find the league with the given code
  try {
    const league = await prisma.leagues.findFirst({
      where: {
        code: formData.code,
      },
    });
    if (league != null) {
      // Add the user to the league
      await prisma.league_users.create({
        data: {
          user_id: session.user.sub,
          league_id: league.id,
        },
      });
    }
    return new Response(JSON.stringify({ message: "League found" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to join league" }), {
      status: 500,
    });
  }
}
