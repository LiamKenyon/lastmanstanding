"use client";
import { useState } from "react";
import Navbar from "../../../components/Navbar";

export default function Fixtures() {
  const [leagueName, setLeagueName] = useState("");
  const [entryAmount, setEntryAmount] = useState(0);
  const [maxRounds, setMaxRounds] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      leagueName,
      entryAmount,
      maxRounds,
    };

    try {
      const response = await fetch("/api/create-league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("League created successfully");
      } else {
        console.error("Failed to create league");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="fixtures-page-container flex min-h-screen flex-col items-start justify-start">
      <Navbar />
      <div className="fixtures-header text-5xl font-semibold ml-44 mt-14">Create a League</div>

      {/* Form Container */}
      <div className="form-container ml-44 mt-10 p-8 bg-white shadow-lg rounded-lg w-1/2">
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* League Name */}
          <div className="flex flex-col">
            <label htmlFor="league-name" className="text-lg font-medium mb-2">
              League Name
            </label>
            <input
              type="text"
              id="league-name"
              name="leagueName"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My League"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
            />
          </div>

          {/* Entry Amount */}
          <div className="flex flex-col">
            <label htmlFor="entry-amount" className="text-lg font-medium mb-2">
              Entry Amount
            </label>
            <input
              type="number"
              id="entry-amount"
              name="entryAmount"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              value={entryAmount}
              onChange={(e) => setEntryAmount(e.target.value)}
            />
          </div>

          {/* Max Rounds */}
          <div className="flex flex-col">
            <label htmlFor="max-rounds" className="text-lg font-medium mb-2">
              Max Rounds
            </label>
            <input
              type="number"
              id="max-rounds"
              name="maxRounds"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unlimited"
              value={maxRounds}
              onChange={(e) => setMaxRounds(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create League
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
// Now users can create leagues, need to be able to join leagues.
// To be able to pick teams, need a script to get all fixtures, for the upcoming round. (already made somewhere)
