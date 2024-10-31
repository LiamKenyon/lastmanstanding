"use client";

import { createClient } from "../../../../../utils/supabase/client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trophy, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

// Function to submit selected team pick
const submitPick = async (userId, leagueId, selectedPick) => {
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
  const response = await fetch(`/api/get-available-picks/${userId}/${leagueId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch picks");
  }
  const data = await response.json();
  return data;
};

const getUsers = async (leagueId) => {
  const response = await fetch(`/api/get-league-users/${leagueId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();

  return data;
};

export default function TeamSelectionPage({ params }) {
  const [picks, setPicks] = useState([]);
  const [selectedPick, setSelectedPick] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEliminated, setIsEliminated] = useState(null);
  const [gameWeeks, setGameWeeks] = useState(null);
  const [winner, setWinner] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState();

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user != null) {
        setUser(user);
      } else {
        // If there's no user, redirect to login
        window.location.href = "/login";
      }
    };

    checkAuth();

    const fetchPicks = async () => {
      try {
        const data = await getPicks(params.userId, params.leagueId);

        setPicks(data.availablePicks);
        setIsEliminated(data.isEliminated);
        setGameWeeks(data.gameWeeks);
        setLoading(false);
        setWinner(data.winner);

        if (data.winner) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await getUsers(params.leagueId);
        console.log("data", data);
        setUsers(data);
        console.log("users", users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
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
      alert("Failed to submit pick");
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "L":
        return "bg-red-500";
      case "D":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#4a82b0]">
        Football Last Man Standing
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {winner ? (
            // Render the "winner" card
            <Card className="border-t-4 border-t-[#e01883]">
              <CardHeader>
                <CardTitle className="text-3xl text-[#4a82b0] flex items-center justify-center">
                  <Trophy className="mr-2 h-8 w-8 text-yellow-500" />
                  Congratulations, Champion!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-6">
                  <p className="text-xl">You've won the Football Last Man Standing League!</p>
                  <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg shadow-inner">
                    <h3 className="font-semibold text-2xl text-[#4a82b0] mb-4">
                      Gameweeks survived: {gameWeeks}
                    </h3>
                    <ul className="space-y-2 text-lg"></ul>
                  </div>
                  <p className="italic text-xl text-[#4a82b0]">
                    "The difference between the impossible and the possible lies in a person's
                    determination." - Tommy Lasorda
                  </p>
                  <div className="pt-4">
                    <Button className="bg-[#4a82b0] hover:bg-[#4a82b0]/90 text-lg px-6 py-3">
                      Join New League <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isEliminated ? (
            // Render the "eliminated" card
            <Card className="border-t-4 border-t-[#e01883]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#4a82b0] flex items-center justify-center">
                  <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                  Better Luck Next Time!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p className="text-lg">
                    Unfortunately, you've been eliminated from this league. But don't worry, there's
                    always next time!
                  </p>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold text-[#4a82b0] mb-2">Your Final Stats</h3>
                    <ul className="space-y-2">
                      <li>Weeks Survived: {gameWeeks}</li>
                    </ul>
                  </div>
                  <div className="pt-4">
                    <Link href="/new-home">
                      <Button className="bg-[#4a82b0] hover:bg-[#4a82b0]/90">
                        Join New League <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Render the "select your team" card
            <Card className="border-t-4 border-t-[#e01883]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#4a82b0]">Select Your Team</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-8">
                    {picks.map((team) => (
                      <TooltipProvider key={team.team}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card
                              className={`cursor-pointer transition-all ${
                                selectedPick?.team === team.team ? "ring-2 ring-[#e01883]" : ""
                              }`}
                              onClick={() => handleTeamClick(team.team, team.date)}
                            >
                              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Avatar className="h-12 w-12 mb-2">
                                  <AvatarImage src={team.teamImg} alt={team.team} />
                                  <AvatarFallback className="bg-[#4a82b0] text-white">
                                    {team.team[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold text-sm">{team.team}</h3>
                                <p className="text-xs text-muted-foreground">vs {team.opponent}</p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedPick}
                    className="bg-[#4a82b0] hover:bg-[#4a82b0]/90"
                  >
                    Submit Pick
                  </Button>
                </div>
                {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card className="border-t-4 border-t-[#e01883]">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a82b0]">League Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {users?.length > 0 && (
                  <ul className="space-y-4">
                    {users.map((user) => (
                      <li key={user.user_id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#4a82b0] text-white">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.display_name}</span>
                        </div>
                        <Badge
                          variant={user.isEliminated === false ? "default" : "secondary"}
                          className={user.isEliminated === false ? "bg-green-500" : "bg-red-500"}
                        >
                          {user.isEliminated === false ? "Active" : "Eliminated"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#e01883]">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a82b0]">Next Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#e01883]">2d 14h 37m</p>
                <p className="text-sm text-muted-foreground">Until picks lock for Gameweek 38</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#e01883]">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a82b0]">How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Select one team each week</li>
                <li>If your team wins, you advance</li>
                <li>You can't pick the same team twice</li>
                <li>Last person standing wins!</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
