"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../../components/Navbar";

export default function Page({ params }) {
  const [picks, setPicks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const response = await fetch(`/api/available-picks/${params.leagueId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPicks(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPicks();
  }, [params.leagueId]);

  return (
    <main>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">League: {params.leagueId}</h1>
      </div>
    </main>
  );
}
