"use client";

import { normalizeGuestPreference } from "@/libs/dateRangeParams";
import { getProfile, updateUserProfile } from "@/libs/profileApi";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ProfileSource {
  name?: string | null;
  email?: string | null;
  telephone?: string | null;
  role?: string | null;
  defaultGuestsAdult?: string | number | null;
  defaultGuestsChild?: string | number | null;
  createdAt?: string | null;
}

interface ProfileFormState {
  name: string;
  email: string;
  telephone: string;
  role: string;
  defaultGuestsAdult: string;
  defaultGuestsChild: string;
  createdAt: string;
}

function buildProfileFormState(source?: ProfileSource | null): ProfileFormState {
  const guestPreference = normalizeGuestPreference(source);

  return {
    name: source?.name ?? "",
    email: source?.email ?? "",
    telephone: source?.telephone ?? "",
    role: source?.role ?? "",
    defaultGuestsAdult: String(guestPreference.defaultGuestsAdult),
    defaultGuestsChild: String(guestPreference.defaultGuestsChild),
    createdAt: source?.createdAt ?? "",
  };
}

function formatMemberSince(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export default function ProfileClient() {
  const { data: session, update } = useSession();
  const editedRef = useRef(false);
  const [form, setForm] = useState<ProfileFormState>(() =>
    buildProfileFormState({
      name: session?.user?.name,
      email: session?.user?.email,
      telephone: session?.user?.telephone,
      role: session?.user?.role,
      defaultGuestsAdult: session?.user?.defaultGuestsAdult,
      defaultGuestsChild: session?.user?.defaultGuestsChild,
    }),
  );
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;
    const token = session?.user?.token;

    if (!token) {
      setIsRefreshingProfile(false);
      return () => {
        ignore = true;
      };
    }

    setIsRefreshingProfile(true);

    getProfile(token)
      .then((profile) => {
        if (ignore || editedRef.current) {
          return;
        }

        setForm(buildProfileFormState(profile));
      })
      .catch(() => {
        if (ignore) {
          return;
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsRefreshingProfile(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [session?.user?.token]);

  const memberSince = useMemo(
    () => formatMemberSince(form.createdAt),
    [form.createdAt],
  );

  const handleFieldChange =
    (field: keyof ProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      editedRef.current = true;
      setSuccess("");
      setError("");
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = session?.user?.token;

    if (!token) {
      setError("Please log in again to update your profile.");
      return;
    }

    const trimmedName = form.name.trim();
    const guestsAdult = Number.parseInt(form.defaultGuestsAdult, 10);
    const guestsChild = Number.parseInt(form.defaultGuestsChild, 10);

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (!Number.isFinite(guestsAdult) || guestsAdult < 1) {
      setError("At least one adult guest is required.");
      return;
    }

    if (!Number.isFinite(guestsChild) || guestsChild < 0) {
      setError("Child guest count cannot be negative.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedProfile = await updateUserProfile(token, {
        name: trimmedName,
        defaultGuestsAdult: guestsAdult,
        defaultGuestsChild: guestsChild,
      });

      const nextFormState = buildProfileFormState(updatedProfile);
      editedRef.current = false;
      setForm(nextFormState);
      setSuccess("Profile updated.");

      await update({
        user: {
          ...session?.user,
          name: updatedProfile.name,
          telephone: updatedProfile.telephone ?? session?.user?.telephone,
          defaultGuestsAdult: updatedProfile.defaultGuestsAdult,
          defaultGuestsChild: updatedProfile.defaultGuestsChild,
        },
      });
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="figma-page flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="figma-panel w-full max-w-[58rem] px-8 py-12 sm:px-11 sm:py-14">
        <div className="mx-auto flex max-w-[34rem] flex-col">
          <h1 className="font-figma-nav text-center text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
            PROFILE
          </h1>

          <p className="mt-4 text-center font-figma-copy text-[1.35rem] text-[var(--figma-ink-soft)]">
            Keep your name current and choose the guest defaults that should prefill future
            bookings.
          </p>

          {memberSince ? (
            <p className="mt-4 text-center font-figma-copy text-[1.2rem] text-[var(--figma-ink-soft)]">
              Member since {memberSince}
            </p>
          ) : null}

          {isRefreshingProfile ? (
            <p className="mt-6 text-center font-figma-copy text-[1.15rem] text-[var(--figma-ink-soft)]">
              Refreshing profile...
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={handleFieldChange("name")}
                className="figma-input"
                placeholder="Name"
                autoComplete="name"
                required
              />
            </label>

            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Email Address</span>
              <input
                type="email"
                value={form.email}
                readOnly
                className="figma-input cursor-default opacity-70"
                placeholder="Email Address"
              />
            </label>

            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Phone Number</span>
              <input
                type="text"
                value={form.telephone}
                readOnly
                className="figma-input cursor-default opacity-70"
                placeholder="Phone Number"
              />
            </label>

            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Role</span>
              <input
                type="text"
                value={form.role.toUpperCase()}
                readOnly
                className="figma-input cursor-default opacity-70"
                placeholder="Role"
              />
            </label>

            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Default Adults</span>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={form.defaultGuestsAdult}
                onChange={handleFieldChange("defaultGuestsAdult")}
                className="figma-input"
                placeholder="Default Adults"
                required
              />
            </label>

            <label className="font-figma-copy text-[2rem] text-[var(--figma-red-soft)]">
              <span className="sr-only">Default Children</span>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={form.defaultGuestsChild}
                onChange={handleFieldChange("defaultGuestsChild")}
                className="figma-input"
                placeholder="Default Children"
                required
              />
            </label>

            <p className="font-figma-copy text-[1.15rem] text-[var(--figma-ink-soft)]">
              These guest counts are used whenever booking pages open without explicit
              guest query parameters.
            </p>

            {success ? (
              <p className="figma-feedback figma-feedback-success font-figma-copy text-center text-[1.2rem]">
                {success}
              </p>
            ) : null}

            {error ? (
              <p className="figma-feedback figma-feedback-error font-figma-copy text-center text-[1.2rem]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              aria-busy={isSaving}
              className="figma-button figma-button-prominent mt-4 h-[2rem] w-full font-figma-nav text-[1.9rem] leading-none"
            >
              {isSaving ? "SAVING" : "SAVE PROFILE"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
