import { cookies } from "next/headers";
const bcrypt = require("bcrypt");
import db from "../../../../../lib/db";

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
  try {
    let formData = await req.json();
    const { email, password } = formData;
    console.log(email, password);

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Search the DB users for the credentials
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          reject(new Error("Database error"));
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate a session ID and set it in cookies
    const sessionId = generateSessionId();

    // Insert the session into the sessions table
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO sessions (sessionid, userid) VALUES (?, ?)", [sessionId, user.id], (err) => {
        if (err) {
          console.error("Error inserting session:", err.message);
          reject(new Error("Error inserting session"));
        } else {
          resolve();
        }
      });
    });

    cookies().set("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return Response.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
