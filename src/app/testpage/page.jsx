// app/dashboard/page.js
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You need to sign in</p>;
  }

  return <p>Welcome, {session.user.name}!</p>;
}
