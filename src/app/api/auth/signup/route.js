import db from "../../../../../lib/db";
const bcrypt = require("bcrypt");

export async function POST(req) {
  try {
    let formData = await req.json();
    const { email, password } = formData;

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          reject(new Error("Database error"));
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
        if (err) {
          console.error("Error inserting user:", err.message);
          reject(new Error("Error inserting user"));
        } else {
          resolve();
        }
      });
    });

    return Response.json({ message: "User created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
