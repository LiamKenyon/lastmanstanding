"use client";

import { signIn } from "next-auth/react";
import Navbar from "../../../components/Navbar";

export default function Signup() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Navbar />
      <div className="signup-header text-primary font-bold text-3xl mb-10">
        Last Man Standing
      </div>
      <div className="form-container">
        <form className="login-form flex flex-col items-center justify-between gap-4">
          <div className="button-container">
            <button className="btn-primary bg-primary text-white my-button-2 hover:opacity-90">
              Sign in
            </button>
            <button className="btn-primary bg-white text-black my-button-2 hover:opacity-90 border-sold border-2 border-primary">
              Sign up
            </button>
          </div>
          <input
            name="email"
            type="text"
            placeholder="Email address"
            className="my-input"
          />
          <input type="text" placeholder="Username" className="my-input" />
          <input type="password" placeholder="Password" className="my-input" />
          <input
            type="password"
            placeholder="Confirm password"
            className="my-input"
          />
          <button className="btn-primary bg-black text-white my-button hover:opacity-90 google-button">
            <img
              src="/svgs/plus-circle.svg"
              alt="Google Icon"
              className="google-icon"
            />
            <div className="google-text">Sign up</div>
          </button>
        </form>
      </div>
    </main>
  );
}
