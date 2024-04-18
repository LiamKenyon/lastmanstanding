import { connectToDatabase } from "../../../../lib/mongodb";
import dates from "../../../../lib/formatdate";

export async function GET(req, res) {
  let { client } = await connectToDatabase();
  let db;
  let allGames = [];
  let counter = 0;
  try {
    // Initialize the db object within the try block
    db = client.db("lastmanstanding-scores");

    for (let date of dates) {
      if (counter >= 7) {
        break;
      }
      const games = await db.collection("last-man-standing").find({ date: date.formatDateAPI }).toArray();
      //console.log(games);
      if (games.length > 0) {
        allGames.push({ date: date.formatDatePath, games });
        counter++;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    // Close the client connection in the finally block
    client.close();
  }
  return Response.json(allGames);
}
