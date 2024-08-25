"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();

  if (session) {
    window.location.href = "/home";
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data.status);
    if (response.status === 200) {
      window.location.href = "/fixtures";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Navbar />
      <div className="login-header text-primary font-bold text-3xl mb-10">Last Man Standing</div>
      <div className="form-container">
        <div method="post" className="login-form flex flex-col items-center justify-center gap-3">
          <div className="login-text">Log in to LMS</div>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="my-input"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="my-input"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="submit"
            onClick={formSubmit}
            className="btn-primary bg-primary text-white my-button hover:opacity-90"
          >
            Log in
          </button>
          <button
            onClick={() => signIn("google")}
            className="btn-primary bg-black text-white my-button hover:opacity-90 google-button"
          >
            <img src="/svgs/icons8-google.svg" alt="Google Icon" className="google-icon" />
            <div className="google-text">Sign in with Google</div>
          </button>
        </div>

        <div className="help-links text-primary text-xs p-1 underline">
          <a href="#" className="help-link">
            Forgot password?
          </a>
          <a href="/signup" className="help-link-divider">
            Sign up for LMS
          </a>
        </div>
      </div>
    </main>
  );
}
