import db from "../../../../lib/db";
import { connectToDatabase } from "../../../../lib/mongodb";

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

// Generate a random alphanumeric session ID
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
    let leagueIdExists = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM leagues WHERE code = ?", [leagueId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    while (leagueIdExists) {
      leagueId = generateLeagueId();
      leagueIdExists = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM leagues WHERE code = ?", [leagueId], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    }

    // Get the user ID from the session ID (example implementation, adjust as per your session handling)
    let userId;
    const session = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM sessions WHERE session_id = ?", [cookies.sessionId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      userId = session.user_id;
    }

    // Check if the league has a name
    if (formData.leagueName === "") {
      formData.leagueName = leagueId;
    }

    // Start transaction to ensure atomicity
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Insert into leagues table
        db.run(
          `INSERT INTO leagues (code, name, entry_amount, max_rounds, created_at, user_id) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [leagueId, formData.leagueName, formData.entryAmount, formData.maxRounds, new Date().toISOString(), userId],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              console.error("Error inserting league:", err.message);
              reject(err);
            }
            const leagueId = this.lastID;

            // Insert into league_users table
            db.run(
              `INSERT INTO league_users (league_id, user_id) 
              VALUES (?, ?)`,
              [leagueId, userId],
              function (err) {
                if (err) {
                  db.run("ROLLBACK");
                  console.error("Error inserting league_user:", err.message);
                  reject(err);
                }
                console.log(`League ${leagueId} created and user ${userId} added successfully.`);
                db.run("COMMIT");
                resolve(this.lastID);
              }
            );
          }
        );
      });
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
  } finally {
    // Close SQLite database connection in the finally block
    db.close((err) => {
      if (err) {
        console.error("Error closing SQLite database:", err.message);
      }
      console.log("Closed SQLite database connection.");
    });
  }
}
