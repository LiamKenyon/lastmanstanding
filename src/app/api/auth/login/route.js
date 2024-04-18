import { connectToDatabase } from "../../../../../lib/mongodb";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");

// Generate a random alphanumeric session ID
function generateSessionId() {
  const length = 32;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sessionId = "";
  for (let i = 0; i < length; i++) {
    sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionId;
}

export async function POST(req) {
  // Initialize variables before the try block
  let { client } = await connectToDatabase();
  let db;
  const formData = await req.json();
  try {
    // Initialize the db object within the try block
    db = client.db("lastmanstanding-scores");

    // Get the users collection
    const user = await db.collection("lastmanstanding-users").findOne({ email: formData.username });

    // Check if the user exists
    if (!user) {
      return Response.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(formData.password, user.password);
    if (!passwordMatch) {
      //console.log(await bcrypt.hash("password", 10));
      return Response.json({ message: "Invalid username or password" }, { status: 401 });
    }

    //  Generate a unique session ID
    let sessionId = generateSessionId();
    let sessiodIdExists = await db.collection("lastmanstanding-sessions").findOne({ sessionId });
    while (sessiodIdExists) {
      sessionId = generateSessionId();
    }

    // Insert the session ID into the database
    await db.collection("lastmanstanding-sessions").insertOne({ sessionId, userId: user._id });
    cookies().set("sessionId", sessionId, { httpOnly: true });
    console.log(sessionId);
    return Response.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    // Close the client connection in the finally block
    client.close();
  }
}
