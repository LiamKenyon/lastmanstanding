const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Determine the database file path
const dbPath = path.join("C:/Users/ellio/Documents/lastmanstanding-next/lastmanstanding-next/db.sqlite");
console.log("Database path:", dbPath);

// Create or open a database file
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});

// Close the database connection when Node.js process exits
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});

module.exports = db;
