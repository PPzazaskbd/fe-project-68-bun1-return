"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tel, email, password }),
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        setError(data.message || data.msg || "Registration failed.");
        return;
      }

      startTransition(() => {
        router.push("/login?registered=1");
      });
    } catch {
      setError("Registration service unavailable.");
    }
  };

  return (
    <main className="figma-page flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="figma-panel w-full max-w-[51.6rem] px-8 py-12 sm:px-11 sm:py-14">
        <h1 className="font-figma-nav text-center text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
          REGISTER
        </h1>

        <form onSubmit={handleRegister} className="mx-auto mt-10 flex max-w-[25rem] flex-col gap-6">
          <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
            <span className="sr-only">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="figma-input"
              placeholder="Name"
              required
            />
          </label>

          <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
            <span className="sr-only">Phone Number</span>
            <input
              type="tel"
              value={tel}
              onChange={(event) => setTel(event.target.value.replace(/\D/g, ""))}
              className="figma-input"
              placeholder="Phone Number"
              required
            />
          </label>

          <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
            <span className="sr-only">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="figma-input"
              placeholder="Email Address"
              required
            />
          </label>

          <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
            <span className="sr-only">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="figma-input"
              placeholder="Password"
              required
              minLength={6}
            />
          </label>

          {error ? (
            <p className="figma-feedback figma-feedback-error font-figma-copy text-center text-[1.2rem]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="figma-button figma-button-prominent mt-4 h-[2rem] w-full font-figma-nav text-[1.9rem] leading-none"
          >
            {isPending ? "REGISTERING" : "REGISTER"}
          </button>
        </form>

        <p className="mt-10 text-center font-figma-copy text-[1.5rem] text-[var(--figma-ink)]">
          Have an account?{" "}
          <Link href="/login" className="text-[var(--figma-red)]">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
