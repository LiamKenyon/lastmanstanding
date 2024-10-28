// Define a type for the team image map
type TeamImageMap = {
  [key: string]: string;
};

// Create the team image map
const teamImageMap: TeamImageMap = {
  Arsenal: "/team-images/arsenal.png",
  "Aston Villa": "/team-images/aston-villa.png",
  "AFC Bournemouth": "/team-images/afc-bournemouth.png",
  Brentford: "/team-images/brentford.png",
  "Brighton & Hove Albion": "/team-images/brighton-&-hove-albion.png",
  Chelsea: "/team-images/chelsea.png",
  "Crystal Palace": "/team-images/crystal-palace.png",
  Everton: "/team-images/everton.png",
  Fulham: "/team-images/fulham.png",
  Liverpool: "/team-images/liverpool.png",
  "Manchester City": "/team-images/manchester-city.png",
  "Manchester United": "/team-images/manchester-united.png",
  "Newcastle United": "/team-images/newcastle-united.png",
  "Nottingham Forest": "/team-images/nottingham-forest.png",
  "Tottenham Hotspur": "/team-images/tottenham-hotspur.png",
  "West Ham United": "/team-images/west-ham-united.png",
  "Wolverhampton Wanderers": "/team-images/wolverhampton-wanderers.png",
  "Ipswich Town": "/team-images/ipswich.png",
  Southampton: "/team-images/southampton.png",
  "Leicester City": "/team-images/leicester.png",
};

// Define the function to get the team image
export const getTeamImage = (teamName: string): string => {
  return teamImageMap[teamName] || "/team-images/default.png";
};
