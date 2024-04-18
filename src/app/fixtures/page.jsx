import Navbar from "../../../components/Navbar";

async function getData() {
  const res = await fetch("http://localhost:3000/api/month-fixtures", { cache: "no-store" });
  return res.json();
}

export default async function Fixtures() {
  const data = await getData();
  console.log(data);
  return (
    <main className="fixtures-page-container flex min-h-screen flex-col items-start justify-start">
      <Navbar />
      <div className="fixtures-header text-5xl font-semibold ml-44 mt-14">Fixtures</div>
      <div className="fixtures-container-full ml-44">
        {data.map(({ date, games }) => (
          <div key={date} className="date-fixture-container">
            <div className="dates text mt-4 text-secondary font-bold text-xl">{date.replace(/-/g, " ")}</div>
            {games.map((game, index) => (
              <div
                key={index}
                className="single-game-container ml-14 p-3 flex flex-row gap-3 items-center justify-between"
              >
                <div className="home-team font-bold">{game.homeNameAbbrv}</div>
                <img
                  className="team-img"
                  src={`/team-images/${game.homeNameFull.toLowerCase().replace(/\s+/g, "-")}.png`}
                  alt=""
                />
                <div className="kick-off-time">{game.startTime}</div>
                <img
                  className="team-img"
                  src={`/team-images/${game.awayNameFull.toLowerCase().replace(/\s+/g, "-")}.png`}
                  alt=""
                />
                <div className="away-team font-bold">{game.awayNameAbbrv}</div>
                <div className="stadium text-xs">{game.venue}</div>
                <div className="quick-view-btn hover:opacity-40 cursor-pointer">Quick View</div>
                <img src="/svgs/arrow-right.svg" alt="M" className="quick-view-svg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>

    // Big div flexed row
    // Inside that, more divs column
  );
}
