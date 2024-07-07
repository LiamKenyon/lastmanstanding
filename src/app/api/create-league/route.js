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

// Generate a random alphanumeric league ID
function generateLeagueId() {
  const length = 8;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let leagueId = "";
  for (let i = 0; i < length; i++) {
    leagueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return leagueId;
}

export async function POST(req) {
  const formData = await req.json();
  const cookies = parseCookies(req);

  try {
    // Check if required fields are provided
    if (!formData.entryAmount || !formData.maxRounds) {
      return new Response(JSON.stringify({ error: "Entry amount and max rounds are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a unique league code
    let leagueId = generateLeagueId();

    let leagueIdExists = await prisma.leagues.findFirst({
      where: {
        code: leagueId,
      },
    });

    while (leagueIdExists) {
      leagueId = generateLeagueId();
      leagueIdExists = await prisma.leagues.findFirst({
        where: {
          code: leagueId,
        },
      });
    }

    // Get the user ID from the session ID (example implementation, adjust as per your session handling)
    const session = await prisma.sessions.findFirst({
      where: {
        session_id: cookies.sessionId,
      },
    });
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const userId = session.user_id;

    // Check if the league has a name
    if (!formData.leagueName) {
      formData.leagueName = leagueId;
    }

    // Insert into leagues table
    const league = await prisma.leagues.create({
      data: {
        code: leagueId,
        name: formData.leagueName,
        entry_amount: parseInt(formData.entryAmount),
        max_rounds: parseInt(formData.maxRounds),
        created_at: new Date(),
        user_id: userId,
      },
    });

    // Insert into league_users table
    await prisma.league_users.create({
      data: {
        league_id: league.id,
        user_id: userId,
      },
    });

    return new Response(JSON.stringify({ message: "League created successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating league:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
