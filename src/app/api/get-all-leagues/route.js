import db from "../../../../lib/db";
import prisma from "../../../../lib/prisma";

// Helper function to parse cookies
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return list;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    list[name.trim()] = decodeURI(rest.join("="));
  });

  return list;
}

export async function GET(req, res) {
  const cookies = parseCookies(req);
  if (!cookies.sessionId) {
    return new Response(JSON.stringify({ error: "Not logged in" }), { status: 401 });
  }

  try {
    // Get the userId from the session table using sessionId
    const session = await prisma.sessions.findFirst({
      where: {
        session_id: cookies.sessionId,
      },
    });

    console.log("session: ", session);

    if (!session) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    const userId = session.user_id;
    console.log(userId);

    // Get the league IDs for the user
    // Use prisma instead
    const leagueIds = await prisma.league_users.findMany({
      where: {
        user_id: userId,
      },
      select: {
        league_id: true,
      },
    });

    console.log("leaguedids: ", leagueIds);

    if (leagueIds.length === 0) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Get the league names using the league IDs with prisma
    const leagues = await prisma.leagues.findMany({
      where: {
        id: {
          in: leagueIds.map((league) => league.league_id),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    console.log(leagues);

    return new Response(JSON.stringify(leagues), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
