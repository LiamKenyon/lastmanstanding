"use client";

const teamSelectButton = ({ team, date }) => {
  const handleTeamSelect = () => {
    console.log(team);
    fetch("http://localhost:3000/api/team-select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team, date }),
    });
  };
  return (
    <button onClick={handleTeamSelect} className="select-team">
      {team}
    </button>
  );
};

export default teamSelectButton;
