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
  let { client } = await connectToDatabase();
  let db;
  const formData = await req.json();

  try {
    // Initialize the db object within the try block
    const cookies = parseCookies(req);
    console.log(cookies);
    db = client.db("lastmanstanding-scores");
    // Create a new league
    let leagueId = generateLeagueId();
    let leagueIdExists = await db.collection("leagues").findOne({ leagueId });
    while (leagueIdExists) {
      leagueId = generateLeagueId();
      leagueIdExists = await db.collection("leagues").findOne({ leagueId });
    }

    // Get the user ID from the session ID
    let userId;
    const session = await db.collection("lastmanstanding-sessions").findOne({ sessionId: cookies.sessionId });
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      userId = session.userId;
    }

    // Check max rounds is empty
    if (formData.maxRounds === "" || formData.maxRounds === 0) {
      formData.maxRounds = "unlimited";
    }

    // Check if the league has a name
    if (formData.leagueName === "") {
      formData.leagueName = leagueId;
    }

    // Create a new league
    await db.collection("lastmanstanding-leagues").insertOne({
      leagueId,
      leagueName: formData.leagueName,
      entryAmount: formData.entryAmount,
      maxRounds: formData.maxRounds,
      createdAt: new Date(),
      userIds: [userId],
    });
    return Response.json({ message: "League created successfully" }, { status: 200 });

    //const user = await db.collection("lastmanstanding-leagues").findOne({}); -- example of how to find a document in a collection
  } catch (error) {
    console.log(error);
  } finally {
    // Close the client connection in the finally block
    client.close();
  }
}
