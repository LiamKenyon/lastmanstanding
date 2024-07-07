import db from "../../../../../lib/db";
import prisma from "../../../../../lib/prisma"; // Import the Prisma client

const bcrypt = require("bcrypt");

export async function POST(req) {
  try {
    let formData = await req.json();
    const { email, password } = formData;

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if the user already exists

    const existingUser = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    console.log(existingUser);
    console.log("GGGGGGGGGGGGG");
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    return Response.json({ message: "User created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
