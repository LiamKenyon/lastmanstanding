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

export async function POST(req) {
  const formData = await req.json();
  const cookies = parseCookies(req);

  // Check if league code is provided
  if (!formData.leagueCode) {
    return new Response(JSON.stringify({ error: "League code is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if session exists in cookies, and if it search for session in db
  if (!cookies.sessionId) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const session = await prisma.sessions.findFirst({
      where: {
        session_id: cookies.sessionId,
      },
    });
    if (session) {
      console.log("Session found");
      // Check if user exists in db
      const user = await prisma.users.findFirst({
        where: {
          id: session.user_id,
        },
      });
      // If user exists, check if league exists, and if it does, add user to league
      if (user) {
        const league = await prisma.leagues.findFirst({
          where: {
            code: formData.leagueCode,
          },
        });
        if (league) {
          // Add to league_users table user_id and league_id
          console.log("League found");
          await prisma.league_users.create({
            data: {
              user_id: user.id,
              league_id: league.id,
            },
          });
        } else {
          console.log("League not found");
        }
      } else {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  return new Response(JSON.stringify({ message: "League joined successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
