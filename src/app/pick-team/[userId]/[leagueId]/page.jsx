"use client";

import { useState, useEffect } from "react";

// Dummy API route for submitting selected team
const submitPick = async (userId, leagueId, selectedTeam) => {
  console.log(selectedTeam);
  /*
  const response = await fetch(`/api/submit-pick/${userId}/${leagueId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedTeam,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit pick");
  }

  return response.json();
  */
};

// Fetch available picks
const getPicks = async (userId, leagueId) => {
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
        setPicks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPicks();
  }, [params.userId, params.leagueId]);

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
          {picks.availablePicks.map((pick) => (
            <li key={pick.id} style={{ marginBottom: "10px" }}>
              <div
                onClick={() => handleTeamClick(pick.homeTeam)}
                style={{
                  cursor: "pointer",
                  border: selectedTeam === pick.homeTeam ? "2px solid blue" : "1px solid gray",
                  padding: "10px",
                }}
              >
                <h2>{pick.homeTeam} (Home)</h2>
              </div>
              <div
                onClick={() => handleTeamClick(pick.awayTeam)}
                style={{
                  cursor: "pointer",
                  border: selectedTeam === pick.awayTeam ? "2px solid blue" : "1px solid gray",
                  padding: "10px",
                }}
              >
                <h2>{pick.awayTeam} (Away)</h2>
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
