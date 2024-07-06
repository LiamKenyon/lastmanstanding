import db from "../../../../lib/db";

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
    const session = await new Promise((resolve, reject) => {
      db.get("SELECT user_id FROM sessions WHERE session_id = ?", [cookies.sessionId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    console.log(session);

    if (!session) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    const userId = session.user_id;
    console.log(userId);

    // Get the league IDs for the user
    const leagueIds = await new Promise((resolve, reject) => {
      db.all("SELECT id FROM leagues WHERE user_id = ?", [userId], (err, rows) => {
        if (err) reject(err);
        resolve(rows.map((row) => row.id));
      });
    });
    console.log(leagueIds);

    if (leagueIds.length === 0) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Get the league names using the league IDs
    const leagues = await new Promise((resolve, reject) => {
      const placeholders = leagueIds.map(() => "?").join(",");
      db.all(`SELECT id, name FROM leagues WHERE id IN (${placeholders})`, leagueIds, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
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
