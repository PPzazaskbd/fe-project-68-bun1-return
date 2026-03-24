"use client";

import DismissibleNotice from "@/components/DismissibleNotice";
import { buildAuthHref } from "@/libs/authRedirect";
import {
  clearPendingOtpRegistration,
  getPendingOtpRegistration,
  PendingOtpRegistration,
  updatePendingOtpRegistration,
} from "@/libs/pendingOtpRegistration";
import { useDismissibleNotice } from "@/libs/useDismissibleNotice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  const record = getRecord(payload);

  return (
    getStringValue(record?.message, record?.msg, record?.error) || fallbackMessage
  );
}

function getOtpMetadata(payload: unknown) {
  const record = getRecord(payload);
  const dataRecord = getRecord(record?.data);

  return {
    otpExpiresAt: getStringValue(dataRecord?.otpExpiresAt, record?.otpExpiresAt) ?? null,
    resendAvailableAt:
      getStringValue(dataRecord?.resendAvailableAt, record?.resendAvailableAt) ?? null,
  };
}

function getLoginRedirectHref(pendingRegistration: PendingOtpRegistration) {
  const searchParams = new URLSearchParams({
    email: pendingRegistration.email,
    verified: "1",
  });

  if (pendingRegistration.callbackUrl !== "/") {
    searchParams.set("callbackUrl", pendingRegistration.callbackUrl);
  }

  return `/login?${searchParams.toString()}`;
}

function getRemainingCooldownMs(resendAvailableAt: string | null, now: number) {
  if (!resendAvailableAt) {
    return 0;
  }

  const targetTime = new Date(resendAvailableAt).getTime();

  if (Number.isNaN(targetTime)) {
    return 0;
  }

  return Math.max(0, targetTime - now);
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const { notice, showNotice, dismissNotice } = useDismissibleNotice();
  const [otp, setOtp] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pendingRegistration, setPendingRegistration] =
    useState<PendingOtpRegistration | null>(null);

  useEffect(() => {
    const pending = getPendingOtpRegistration();

    if (!pending) {
      router.replace("/register");
      return;
    }

    setPendingRegistration(pending);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const cooldownMs = getRemainingCooldownMs(
      pendingRegistration?.resendAvailableAt ?? null,
      Date.now(),
    );

    if (cooldownMs <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [pendingRegistration?.resendAvailableAt]);

  const registerHref = buildAuthHref("/register", pendingRegistration?.callbackUrl ?? null);
  const loginHref = buildAuthHref("/login", pendingRegistration?.callbackUrl ?? null);
  const resendCooldownMs = getRemainingCooldownMs(
    pendingRegistration?.resendAvailableAt ?? null,
    now,
  );
  const resendCooldownSeconds = Math.ceil(resendCooldownMs / 1000);
  const canResend = resendCooldownMs <= 0;

  const handleStartOver = () => {
    dismissNotice(true);
    clearPendingOtpRegistration();
    router.push(registerHref);
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dismissNotice(true);

    if (!pendingRegistration) {
      clearPendingOtpRegistration();
      router.replace("/register");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingRegistration.email,
          otp,
        }),
      });
      const payload = (await response.json().catch(() => null)) as unknown;
      const record = getRecord(payload);

      if (!response.ok || record?.success === false) {
        showNotice({
          type: "error",
          message: getErrorMessage(payload, "OTP verification failed."),
        });
        setIsSubmitting(false);
        return;
      }

      clearPendingOtpRegistration();
      router.push(getLoginRedirectHref(pendingRegistration));
      router.refresh();
    } catch {
      showNotice({
        type: "error",
        message: "OTP verification service unavailable.",
      });
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    dismissNotice(true);

    if (!pendingRegistration || !canResend) {
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingRegistration.email }),
      });
      const payload = (await response.json().catch(() => null)) as unknown;
      const record = getRecord(payload);

      if (!response.ok || record?.success === false) {
        showNotice({
          type: "error",
          message: getErrorMessage(payload, "Could not resend OTP."),
        });
        setIsResending(false);
        return;
      }

      const nextPendingRegistration =
        updatePendingOtpRegistration(getOtpMetadata(payload)) ?? pendingRegistration;
      setPendingRegistration(nextPendingRegistration);
      setNow(Date.now());
      showNotice({
        type: "success",
        message: `A new OTP was sent to ${pendingRegistration.email}.`,
      });
      setIsResending(false);
    } catch {
      showNotice({
        type: "error",
        message: "OTP resend service unavailable.",
      });
      setIsResending(false);
    }
  };

  return (
    <main className="figma-page flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="figma-panel w-full max-w-[38rem] px-8 py-12 sm:px-11 sm:py-14">
        <h1 className="font-figma-nav text-center text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
          VERIFY OTP
        </h1>

        <p className="mt-4 text-center font-figma-copy text-[1.35rem] text-[var(--figma-ink-soft)]">
          {isLoading
            ? "Preparing verification..."
            : `Enter the 6-digit code we sent to ${pendingRegistration?.email ?? "your email"}.`}
        </p>

        {!isLoading && pendingRegistration?.otpExpiresAt ? (
          <p className="mt-3 text-center font-figma-copy text-[1.2rem] text-[var(--figma-ink-soft)]">
            Code expires at{" "}
            {new Date(pendingRegistration.otpExpiresAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
        ) : null}

        <form onSubmit={handleVerify} className="mx-auto mt-10 flex max-w-[25rem] flex-col gap-6">
          <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
            <span className="sr-only">OTP Code</span>
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\s+/g, "").slice(0, 6))}
              className="figma-input"
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              disabled={isLoading || isSubmitting || isResending}
            />
          </label>

          <DismissibleNotice notice={notice} onClose={dismissNotice} />

          <button
            type="submit"
            disabled={isLoading || isSubmitting || isResending}
            aria-busy={isSubmitting}
            className="figma-button figma-button-prominent h-[2rem] w-full font-figma-nav text-[1.9rem] leading-none"
          >
            {isSubmitting ? "VERIFYING" : "VERIFY OTP"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading || isSubmitting || isResending || !canResend}
            className="figma-button-secondary h-[2rem] w-full font-figma-nav text-[1.45rem] leading-none"
          >
            {isResending
              ? "SENDING"
              : canResend
                ? "RESEND OTP"
                : `RESEND IN ${resendCooldownSeconds}s`}
          </button>

          <button
            type="button"
            onClick={handleStartOver}
            disabled={isSubmitting || isResending}
            className="figma-button-secondary h-[2rem] w-full font-figma-nav text-[1.45rem] leading-none"
          >
            START OVER
          </button>
        </form>

        <p className="mt-10 text-center font-figma-copy text-[1.4rem] text-[var(--figma-ink)]">
          Already verified?{" "}
          <Link href={loginHref} className="text-[var(--figma-red)]">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
