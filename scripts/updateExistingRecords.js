const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateLeagues() {
  try {
    // Update existing records with default values
    await prisma.leagues.updateMany({
      // No need for a condition here to match existing records
      data: {
        gameWeekNo: 1, // Set gameWeekNo to 1
        gameWeekDate: new Date("2024-08-05T00:00:00.000Z"), // Set gameWeekDate to August 5, 2024
      },
    });

    console.log("Leagues updated successfully.");
  } catch (error) {
    console.error("Error updating leagues:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLeagues();
