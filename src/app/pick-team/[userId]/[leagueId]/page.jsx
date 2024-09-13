"use client";

import { useState, useEffect } from "react";

// Dummy API route for submitting selected team
const submitPick = async (userId, leagueId, selectedTeam) => {
  console.log(selectedTeam);
  console.log(userId);

  const response = await fetch(`/api/submit-pick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedTeam,
      userId,
      leagueId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit pick");
  }

  return response.json();
};

// Fetch available picks
const getPicks = async (userId, leagueId) => {
  console.log("USERID", userId);
  const response = await fetch(`/api/get-available-picks/${userId}/${leagueId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch picks");
  }

  return response.json();
};

export default function PickTeam({ params }) {
  const [picks, setPicks] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const data = await getPicks(params.userId, params.leagueId);
        setPicks(data.availablePicks); // Data is now an array of team names
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPicks();
  }, []);

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSuccessMessage(null); // Reset success message on new selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam) {
      setError("No team selected!");
      return;
    }

    try {
      await submitPick(params.userId, params.leagueId, selectedTeam);
      setSuccessMessage(`Pick submitted successfully for ${selectedTeam}!`);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!picks) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Available Picks</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {picks.map((teamName, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <div
                onClick={() => handleTeamClick(teamName)}
                style={{
                  cursor: "pointer",
                  border: selectedTeam === teamName ? "2px solid blue" : "1px solid gray",
                  padding: "10px",
                }}
              >
                <h2>{teamName}</h2>
              </div>
            </li>
          ))}
        </ul>

        <button type="submit" disabled={!selectedTeam}>
          Submit Pick
        </button>
      </form>

      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </div>
  );
}
