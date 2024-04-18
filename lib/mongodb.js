import { MongoClient, ServerApiVersion, Db } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient;
let cachedDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // load from cache
    return { cachedClient, cachedDb };
  }
  const opts = {
    serverApi: ServerApiVersion.v1,
  };

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  //let db = client.db("lastmanstanding-scores");

  // Cache the client and db
  cachedClient = client;
  //cachedDb = db;

  return {
    client: cachedClient,
    //db: cachedDb,
  };
}
