"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.status === 200) {
      window.location.href = "/login";
    } else {
      alert(data.error || "An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Navbar />
      <div className="signup-header text-primary font-bold text-3xl mb-10">Last Man Standing</div>
      <div className="form-container">
        <form className="login-form flex flex-col items-center justify-between gap-4" onSubmit={formSubmit}>
          <div className="button-container">
            <button
              type="button"
              className="btn-primary bg-primary text-white my-button-2 hover:opacity-90"
              onClick={() => (window.location.href = "/login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="btn-primary bg-white text-black my-button-2 hover:opacity-90 border-sold border-2 border-primary"
            >
              Sign up
            </button>
          </div>
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
          <input
            type="password"
            placeholder="Confirm password"
            className="my-input"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button type="submit" className="btn-primary bg-black text-white my-button hover:opacity-90 google-button">
            <img src="/svgs/plus-circle.svg" alt="Google Icon" className="google-icon" />
            <div className="google-text">Sign up</div>
          </button>
        </form>
      </div>
    </main>
  );
}
