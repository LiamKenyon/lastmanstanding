"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";

export default function JoinLeague() {
  const [leagueCode, setLeagueCode] = useState("");

  const handleLeagueCodeChange = (e) => {
    setLeagueCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("League Code Submitted: ", leagueCode);
    const formData = { leagueCode };
    try {
      const response = await fetch("/api/join-league", {
        method: "POST",
        headers: {
          "Conent-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("League joined successfully");
      } else {
        console.error("Failed to join league");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="fixtures-page-container flex min-h-screen flex-col items-start justify-start">
      <Navbar />
      <div className="fixtures-header text-5xl font-semibold ml-44 mt-14">Join a League</div>
      <form onSubmit={handleSubmit} className="ml-44 mt-10">
        <label htmlFor="league-code" className="block text-lg font-medium text-gray-700">
          League Code
        </label>
        <input
          type="text"
          id="league-code"
          value={leagueCode}
          onChange={handleLeagueCodeChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Join League
        </button>
      </form>
    </main>
  );
}
