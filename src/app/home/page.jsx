"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";

const getUserLeagues = async () => {
  const response = await fetch("http://localhost:3000/api/get-all-leagues", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leagues");
  }

  return response.json();
};

export default function Login() {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);

  const handleGetUserLeagues = async () => {
    try {
      const data = await getUserLeagues();
      setLeagues(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="view-leagues-container">
        <div className="h3 view-leagues-heading">View your leagues here</div>
        <button onClick={handleGetUserLeagues} className="view-leagues-btn">
          View
        </button>
        {error && <div className="error">{error}</div>}
        <ul>
          {leagues.map((league) => (
            <li key={league.id}>{league.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
