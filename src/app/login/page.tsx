"use client";

import DismissibleNotice from "@/components/DismissibleNotice";
import { buildAuthHref, getSafeCallbackUrl } from "@/libs/authRedirect";
import { useDismissibleNotice } from "@/libs/useDismissibleNotice";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = getSafeCallbackUrl(requestedCallbackUrl);
  const registerHref = buildAuthHref("/register", requestedCallbackUrl);
  const { notice, showNotice, dismissNotice } = useDismissibleNotice();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dismissNotice(true);
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        showNotice({ type: "error", message: "Invalid email or password." });
        setIsSubmitting(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      showNotice({ type: "error", message: "Login service unavailable." });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="figma-page flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="figma-panel w-full max-w-[34.5rem] px-8 py-12 sm:px-11 sm:py-14">
        <h1 className="font-figma-nav text-center text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
          LOG IN
        </h1>

        <form onSubmit={handleLogin} className="mx-auto mt-10 flex max-w-[25rem] flex-col gap-10">
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
            />
          </label>

          <DismissibleNotice notice={notice} onClose={dismissNotice} />

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="figma-button figma-button-prominent h-[2rem] w-full font-figma-nav text-[1.9rem] leading-none"
          >
            {isSubmitting ? "LOGGING IN" : "LOG IN"}
          </button>
        </form>

        <p className="mt-10 text-center font-figma-copy text-[1.5rem] text-[var(--figma-ink)]">
          New here?{" "}
          <Link href={registerHref} className="text-[var(--figma-red)]">
            Register.
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
