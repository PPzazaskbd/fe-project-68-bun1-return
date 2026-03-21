"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://a08-venue-explorer-backend.vercel.app/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, tel, email, password }),
        }
      );
      const data = await res.json();

      if (res.ok && data.success !== false) {
        router.push("/login?registered=1");
      } else {
        setError(data.message || data.msg || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base w-full";
  const labelClass =
    "text-xs tracking-[0.2em] uppercase";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: "linear-gradient(160deg, #FAF7F2 0%, #F0E8DC 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="h-px flex-1 bg-[#C4973A] opacity-40" />
          <span
            className="text-[#C4973A] text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant SC', serif" }}
          >
            Create Account
          </span>
          <div className="h-px flex-1 bg-[#C4973A] opacity-40" />
        </div>

        <div
          className="bg-white shadow-xl p-8 sm:p-10"
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
            Register
          </h1>
          <p
            className="text-center text-sm mb-8 tracking-widest uppercase"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            Bun1 Hotel Collection
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
                placeholder="Your full name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Telephone Number
              </label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
                placeholder="e.g. 0812345678"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
                placeholder="Minimum 6 characters"
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
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            Already have an account?{" "}
            <Link href="/login" className="underline" style={{ color: "#C4973A" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
