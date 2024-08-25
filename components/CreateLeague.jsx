"use client";

import { useState } from "react";

const CreateLeague = ({ onClose }) => {
  // State to manage form inputs
  const [leagueName, setLeagueName] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch("/api/create-league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: leagueName }), // Send league name as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to create league");
      }

      const data = await response.json();
      console.log("League created successfully:", data);

      // Clear the form and close the modal
      setLeagueName("");
      onClose();
    } catch (error) {
      console.error("Error creating league:", error);
    }
  };

  return (
    <div className="join-league-card relative">
      {/* Close button */}
      <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
        &times;
      </button>

      <div className="fixtures-header text-3xl font-semibold">Create a League</div>

      <form className="mt-10" onSubmit={handleSubmit}>
        <input
          name="leagueName"
          type="text"
          id="league-name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)} // Update state on input change
          className="join-league-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter league name"
          required // Make input required
        />
        <button
          type="submit"
          className="mt-4 mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create league
        </button>
      </form>
    </div>
  );
};

export default CreateLeague;
