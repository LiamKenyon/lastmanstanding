import Navbar from "../../../components/Navbar";

async function getData() {
  const res = await fetch("http://localhost:3000/api/league", { cache: "no-store" });
  return res.json();
}

export default async function Table() {
  let data = await getData();
  data = data[0].table;
  return (
    <section className="table-container">
      <Navbar />
      <div className="table-and-games-container flex flex-row align-center- justify-around">
        <div className="table-container">
          <div className="table-text">Premier League Table</div>

          <div className="table-headers">
            <div className="table-header flex flex-row justify-between items-center">
              <div className="position-header">Position</div>
              <div className="team-name-header">Team</div>
              <div className="played-header">Played</div>
              <div className="won-header">Won</div>
              <div className="drawn-header">Drawn</div>
              <div className="lost-header">Lost</div>
              <div className="points-header">Points</div>
            </div>
          </div>
          <div className="table-teams-container">
            {data.map((team, index) => (
              <div key={index} className="table-team flex flex-row justify-between items-center">
                <div className="position">{team.position}</div>
                <div className="team-name">{team.teamName}</div>
                <div className="played">{team.gamesPlayed}</div>
                <div className="won">{team.gamesWon}</div>
                <div className="drawn">{team.gamesDrawn}</div>
                <div className="lost">{team.gamesLost}</div>
                <div className="points">{team.points}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="games-container">Games</div>
      </div>
    </section>
  );
}
