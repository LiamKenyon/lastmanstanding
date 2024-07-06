import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import prisma from "../../../../../lib/prisma"; // Import the Prisma client

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
  console.log(prisma.sessions);
  console.log("GGGGGGGGGGGGGGGGGGGGGGGG");
  try {
    let formData = await req.json();
    const { email, password } = formData;
    console.log(email, password);

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Search the DB users for the credentials
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
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
    await prisma.sessions.create({
      data: {
        session_id: sessionId,
        user_id: user.id,
      },
    });

    cookies().set("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return Response.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
