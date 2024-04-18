import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req) {
  const result = await req.json();
  console.log(result);
  return Response.json(result);
}
