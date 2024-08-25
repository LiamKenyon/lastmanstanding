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
  try {
    const createdLeague = await prisma.leagues.create({
      data: {
        name: formData.name,
        code: await getUniqueLeagueId(),
        user_id: session.user.sub,
      },
      select: {
        id: true,
      },
    });
    await prisma.league_users.create({
      data: {
        user_id: session.user.sub,
        league_id: createdLeague.id,
      },
    });
    return new Response(JSON.stringify({ message: "League created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create league" }), {
      status: 500,
    });
  }
}
