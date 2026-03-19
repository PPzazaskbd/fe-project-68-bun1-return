"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res?.error) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: "linear-gradient(160deg, #FAF7F2 0%, #F0E8DC 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Decorative top line */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="h-px flex-1 bg-[#C4973A] opacity-40" />
          <span
            className="text-[#C4973A] text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant SC', serif" }}
          >
            Welcome Back
          </span>
          <div className="h-px flex-1 bg-[#C4973A] opacity-40" />
        </div>

        <div
          className="bg-white shadow-xl p-10"
          style={{ border: "1px solid #E8D5B7" }}
        >
          <h1
            className="text-4xl text-center mb-2 tracking-wide"
            style={{
              fontFamily: "'Cormorant SC', serif",
              color: "#1A1208",
              fontWeight: 500,
            }}
          >
            Sign In
          </h1>
          <p
            className="text-center text-sm mb-8 tracking-widest uppercase"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            Bun1 Hotel Collection
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
                style={{ fontFamily: "'Cormorant SC', serif" }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
                style={{ fontFamily: "'Cormorant SC', serif" }}
              />
            </div>

            {error && (
              <p
                className="text-sm text-center"
                style={{ color: "#8B3A3A", fontFamily: "'Cormorant SC', serif" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3 text-white tracking-[0.3em] uppercase text-sm transition-opacity disabled:opacity-60"
              style={{
                background: "#1A1208",
                fontFamily: "'Cormorant SC', serif",
                letterSpacing: "0.3em",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            New to Bun1?{" "}
            <Link href="/venue" className="underline" style={{ color: "#C4973A" }}>
              Browse our venues
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
