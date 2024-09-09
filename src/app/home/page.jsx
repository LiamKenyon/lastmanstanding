"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import JoinLeague from "../../../components/JoinLeague";
import CreateLeague from "../../../components/CreateLeague";

const getUserLeagues = async () => {
  const response = await fetch("/api/get-all-leagues", {
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

export default function Home() {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);
  const [showJoinLeague, setShowJoinLeague] = useState(false);
  const [showCreateLeague, setShowCreateLeague] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await getUserLeagues();
        setLeagues(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeagues();
  }, []);

  const handleJoinLeagueClick = () => {
    setShowJoinLeague(!showJoinLeague);
    setShowCreateLeague(false); // Hide Create League when Join League is shown
  };

  const handleCreateLeagueClick = () => {
    setShowCreateLeague(!showCreateLeague);
    setShowJoinLeague(false); // Hide Join League when Create League is shown
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view your leagues.</div>;
  }

  return (
    <main className="home-page">
      <Navbar />
      <div className="home-container">
        <div className="home-left-container">
          <h1>
            View Your <br />
            Active Leagues
          </h1>
          <div className="active-leagues-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leagues.length > 0 ? (
                  leagues.map((league) => (
                    <tr key={league.id}>
                      <td>
                        <Link href={`/pick-team/${session.user.sub}/${league.id}`}>{league.name}</Link>
                      </td>
                      <td>
                        {league.isEliminated ? (
                          <img src="/svgs/xmark.svg" alt="Eliminated" />
                        ) : (
                          <img src="/svgs/check.svg" alt="Active" />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No leagues found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="home-button-container">
            <button onClick={handleJoinLeagueClick} className="join-league">
              Join league
            </button>
            <button onClick={handleCreateLeagueClick} className="create-league">
              Create league
            </button>
          </div>
          <h3 className="rules-heading">
            Unsure how to play? Click{" "}
            <Link href="#" id="rules-link">
              here
            </Link>{" "}
            to find out
          </h3>
        </div>
        <div className="home-right-container">
          <h1>Upcoming scores and fixtures</h1>
          <p id="your-teams">Your Teams</p>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src="/team-images/aston-villa.png" width="24px" alt="Aston Villa" />
                </td>
                <td>1 - 0</td>
                <td>
                  <img src="/team-images/arsenal.png" width="24px" alt="Arsenal" />
                </td>
              </tr>
            </tbody>
          </table>
          <p>Elsewhere</p>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src="/team-images/aston-villa.png" width="24px" alt="Aston Villa" />
                </td>
                <td>1 - 0</td>
                <td>
                  <img src="/team-images/arsenal.png" width="24px" alt="Arsenal" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {showJoinLeague && <JoinLeague onClose={() => setShowJoinLeague(false)} />}
      {showCreateLeague && <CreateLeague onClose={() => setShowCreateLeague(false)} />}
    </main>
  );
}
