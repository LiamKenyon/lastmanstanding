const { PrismaClient } = require("@prisma/client");

// Define a global variable to hold the Prisma Client instance
let prisma;

if (process.env.NODE_ENV === "production") {
  // In production, always create a new PrismaClient instance
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to store the PrismaClient instance
  // This prevents creating multiple instances during hot reloads
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

module.exports = prisma;
