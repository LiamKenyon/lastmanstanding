import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const formData = await req.json();

  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Check if the users canPick is false
  const user = await prisma.league_users.findUnique({
    where: {
      league_id_user_id: {
        league_id: parseInt(formData.leagueId),
        user_id: formData.userId,
      },
    },
    select: {
      canPick: true,
      isEliminated: true,
    },
  });

  if (!user.canPick || user.isEliminated) {
    return new Response(JSON.stringify({ message: "You cannot make a pick at this time." }), {
      status: 400,
    });
  }

  // Fetch the user's previous picks for this league
  const picks = await prisma.picks.findMany({
    where: {
      user_id: formData.userId,
      league_id: parseInt(formData.leagueId),
    },
    select: {
      teamName: true,
    },
  });

  // Extract team names from previous picks
  const teamNames = picks.map((pick) => pick.teamName);
  console.log("User's previous picks:", teamNames);

  // Check if the selected team has already been picked
  if (teamNames.includes(formData.selectedTeam)) {
    return new Response(JSON.stringify({ message: "You have already picked this team." }), { status: 400 });
  }

  // Insert the new pick into the database
  const insertPick = await prisma.picks.create({
    data: {
      user_id: formData.userId,
      league_id: parseInt(formData.leagueId),
      teamName: formData.selectedTeam,
    },
  });

  // Update the user's canPick status
  await prisma.league_users.update({
    where: {
      league_id_user_id: {
        user_id: formData.userId,
        league_id: parseInt(formData.leagueId),
      },
    },
    data: {
      canPick: false,
    },
  });

  console.log("Inserted pick:", insertPick);

  return new Response(JSON.stringify({ message: "Pick submitted successfully." }), {
    status: 200,
  });
}
