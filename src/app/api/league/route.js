"use client";

import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(req, res) {
  // Initialize variables before the try block
  let { client } = await connectToDatabase();
  let db;
  let league;

  try {
    // Initialize the db object within the try block
    db = client.db("lastmanstanding-scores");

    // Get the users collection
    league = await db.collection("leagues").find({ leagueName: "Premier League Table" }).toArray();
  } catch (error) {
    console.log(error);
  } finally {
    // Close the client connection in the finally block
    client.close();
  }
  return Response.json(league);
}
