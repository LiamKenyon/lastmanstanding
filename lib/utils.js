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

// Export the function
module.exports = { parseCookies, generateLeagueId, getUserIdFromSession, getUniqueLeagueId };
