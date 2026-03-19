"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      alert("welcome");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>

      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}