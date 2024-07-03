import Navbar from "../../../components/Navbar";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <main>
      <Navbar />
      <div className="view-leagues-container">
        <div className="h3 view-leagues-heading">View your leagues here</div>
        <button className="view-leagues-btn">View</button>
      </div>
    </main>
    // Going to want to have an api to call that fetches all teh leagues that the user is in
    // Call that API when the button is clicked or when the page is loaded, and display the leagues in a list
    // For now just the simple info of the league

    // In the future we will display the teams the user has already picked and a history of the rounds
  );
}
