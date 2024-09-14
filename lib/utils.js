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

const generateFormattedDatesUntilSunday = () => {
  const formattedDates = [];
  const date_ob = new Date();
  const currentDayOfWeek = date_ob.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysUntilSunday = 9 - currentDayOfWeek; // Days remaining until the next Sunday

  for (let i = 0; i < daysUntilSunday; i++) {
    const tempDate = new Date(date_ob);
    tempDate.setDate(date_ob.getDate() + i);
    const weekday = tempDate.toLocaleString("en-us", { weekday: "long" });
    let date = tempDate.getDate().toString();
    if (date.length === 1) {
      date = "0" + date;
    }
    let month = (tempDate.getMonth() + 1).toString().padStart(2, "0");
    let year = tempDate.getFullYear();
    let monthName = tempDate.toLocaleString("default", { month: "long" });

    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formatDatePath = `${weekday}-${date}${nth(date)}-${monthName}`;
    const formatDateAPI = `${year}-${month}-${date}`;
    const formatDateISO = tempDate.toISOString(); // ISO 8601 format

    formattedDates.push({ formatDatePath, formatDateAPI, formatDateISO });
  }
  return formattedDates;
};

//generateFormattedDatesUntilSunday();
// Export the function
module.exports = {
  parseCookies,
  generateLeagueId,
  getUserIdFromSession,
  getUniqueLeagueId,
  generateFormattedDatesUntilSunday,
};
