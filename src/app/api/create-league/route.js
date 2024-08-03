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

// Check if a user exists based on the session cookie
async function getUserIdFromSession(sessionId) {
  if (!sessionId) {
    console.log("No sessionId provided");
    return null;
  }

  console.log("sessionId:", sessionId);
  const session = await prisma.sessions.findFirst({
    where: {
      session_id: sessionId,
    },
  });
  console.log("session:", session);
  return session ? session.user_id : null;
}

// Ensure the generated league ID is unique
async function getUniqueLeagueId() {
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

  return leagueId;
}

// Validate form data
function validateFormData(formData) {
  if (!formData.entryAmount || !formData.maxRounds) {
    return { valid: false, message: "Entry amount and max rounds are required" };
  }
  return { valid: true };
}

// Create a league and add the user to it
async function createLeague(formData, userId) {
  const leagueId = await getUniqueLeagueId();

  const leagueName = formData.leagueName || leagueId;

  const league = await prisma.leagues.create({
    data: {
      code: leagueId,
      name: leagueName,
      entry_amount: parseInt(formData.entryAmount),
      max_rounds: parseInt(formData.maxRounds),
      created_at: new Date(),
      user_id: userId,
    },
  });

  await prisma.league_users.create({
    data: {
      league_id: league.id,
      user_id: userId,
    },
  });

  return league;
}

export async function POST(req) {
  const formData = await req.json();
  const cookies = parseCookies(req);

  // Validate form data
  const { valid: formValid, message: formMessage } = validateFormData(formData);
  if (!formValid) {
    return new Response(JSON.stringify({ error: formMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get the user ID from the session cookie
  const userId = await getUserIdFromSession(cookies.sessionId);
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Create the league
    await createLeague(formData, userId);
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
