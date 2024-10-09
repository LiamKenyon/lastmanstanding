"use client";

import { useState, useEffect } from "react";

// Dummy API route for submitting selected team
const submitPick = async (userId, leagueId, selectedPick) => {
  console.log(selectedPick);
  console.log(userId);

  const response = await fetch(`/api/submit-pick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedPick,
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
  const [selectedPick, setSelectedPick] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const data = await getPicks(params.userId, params.leagueId);
        console.log(data);
        setPicks(data.availablePicks); // Data is now an array of objects with team and date
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPicks();
  }, [params.userId, params.leagueId]);

  const handleTeamClick = (team, date) => {
    setSelectedPick({ team, date });
    setSuccessMessage(null); // Reset success message on new selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPick) {
      setError("No team selected!");
      return;
    }

    try {
      await submitPick(params.userId, params.leagueId, selectedPick);
      setSuccessMessage(`Pick submitted successfully for ${selectedPick.team}!`);
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
          {picks.map((pick, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <div
                onClick={() => handleTeamClick(pick.team, pick.date)}
                style={{
                  cursor: "pointer",
                  border: selectedPick?.team === pick.team ? "2px solid blue" : "1px solid gray",
                  padding: "10px",
                }}
              >
                <h2>{pick.team}</h2>
                {/* You may choose to display the date here if needed */}
              </div>
            </li>
          ))}
        </ul>

        <button type="submit" disabled={!selectedPick}>
          Submit Pick
        </button>
      </form>

      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </div>
  );
}
