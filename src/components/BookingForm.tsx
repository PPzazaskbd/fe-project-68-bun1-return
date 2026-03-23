"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HotelItem } from "@/interface";
import { calculateNights, getTodayIsoDate } from "@/libs/bookingStorage";
import { buildDateRangeHref, getDateRangeFromSearchParams } from "@/libs/dateRangeParams";
import { createBooking } from "@/libs/bookingsApi";

interface BookingFormProps {
  hotels: HotelItem[];
}

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function generateRandomRoomNumber() {
  return String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
}

function getComparableValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const candidate = value as {
      _id?: unknown;
      id?: unknown;
      name?: unknown;
    };

    if (typeof candidate._id === "string" || typeof candidate._id === "number") {
      return String(candidate._id);
    }

    if (typeof candidate.id === "string" || typeof candidate.id === "number") {
      return String(candidate.id);
    }

    if (typeof candidate.name === "string" || typeof candidate.name === "number") {
      return String(candidate.name);
    }
  }

  return "";
}

function normalizeValue(value: unknown) {
  return getComparableValue(value).trim().toLowerCase();
}

function findHotelByReference(
  hotels: HotelItem[],
  reference?: string | null,
  venue?: string | null,
) {
  const normalizedReference = normalizeValue(reference ?? undefined);
  const normalizedVenue = normalizeValue(venue ?? undefined);

  return hotels.find((item) => {
    const candidateIds = [item._id, item.id].map((value) => normalizeValue(value));
    const candidateName = normalizeValue(item.name);

    return (
      (!!normalizedReference && candidateIds.includes(normalizedReference)) ||
      (!!normalizedVenue && candidateName === normalizedVenue)
    );
  });
}

export default function BookingForm({ hotels }: BookingFormProps) {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = getTodayIsoDate();
  const initialHotel = hotels[0]?.name ?? "";
  const toolbarState = getDateRangeFromSearchParams(
    searchParams,
    today,
    session?.user,
  );
  const bookingSeed = searchParams.toString();

  const [hotel, setHotel] = useState(initialHotel);
  const [guestsAdult, setGuestsAdult] = useState(toolbarState.guestsAdult);
  const [guestsChild, setGuestsChild] = useState(toolbarState.guestsChild);
  const [checkIn, setCheckIn] = useState(toolbarState.checkIn);
  const [checkOut, setCheckOut] = useState(toolbarState.checkOut);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roomNumber = useMemo(() => generateRandomRoomNumber(), [bookingSeed]);

  useEffect(() => {
    const hotelId = searchParams.get("hotelId");
    const venue = searchParams.get("venue");
    const from = searchParams.get("checkIn");
    const to = searchParams.get("checkOut");
    const adults = searchParams.get("guestsAdult");
    const children = searchParams.get("guestsChild");
    const matchedHotel = findHotelByReference(hotels, hotelId, venue);

    if (matchedHotel) {
      setHotel(matchedHotel.name);
    } else if (venue) {
      setHotel(decodeURIComponent(venue));
    }

    if (from) setCheckIn(from);
    if (to) setCheckOut(to);
    setGuestsAdult(Math.max(1, Number(adults) || toolbarState.guestsAdult));
    setGuestsChild(Math.max(0, Number(children) || toolbarState.guestsChild));
  }, [bookingSeed, hotels, searchParams, toolbarState.guestsAdult, toolbarState.guestsChild]);

  const requestedHotelId = searchParams.get("hotelId");
  const requestedVenue = searchParams.get("venue");
  const selectedHotel = useMemo(
    () => findHotelByReference(hotels, requestedHotelId, requestedVenue) ??
      hotels.find((item) => item.name === hotel),
    [hotel, hotels, requestedHotelId, requestedVenue],
  );
  const submissionHotelId = requestedHotelId || selectedHotel?.id || selectedHotel?._id || "";
  const currentToolbarState = {
    checkIn,
    checkOut,
    guestsAdult,
    guestsChild,
  };
  const currentHotelId = selectedHotel?.id || selectedHotel?._id || requestedHotelId || "";
  const currentVenue = selectedHotel?.name || requestedVenue || hotel;
  const backHref = useMemo(() => {
    return currentHotelId
      ? buildDateRangeHref(`/venue/${encodeURIComponent(currentHotelId)}`, currentToolbarState)
      : buildDateRangeHref("/venue", currentToolbarState);
  }, [checkIn, checkOut, currentHotelId, guestsAdult, guestsChild]);

  const nights = Math.max(1, calculateNights(checkIn, checkOut));
  const total = (selectedHotel?.price ?? 0) * nights;
  const bookingCallbackUrl = useMemo(() => {
    const nextParams = new URLSearchParams();

    if (currentHotelId) {
      nextParams.set("hotelId", currentHotelId);
    }

    if (currentVenue) {
      nextParams.set("venue", currentVenue);
    }

    nextParams.set("checkIn", checkIn);
    nextParams.set("checkOut", checkOut);
    nextParams.set("guestsAdult", String(guestsAdult));
    nextParams.set("guestsChild", String(guestsChild));

    return `${pathname}?${nextParams.toString()}`;
  }, [
    checkIn,
    checkOut,
    currentHotelId,
    currentVenue,
    guestsAdult,
    guestsChild,
    pathname,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!session?.user?.token) {
      router.push(`/login?callbackUrl=${encodeURIComponent(bookingCallbackUrl)}`);
      return;
    }

    if (!submissionHotelId) {
      setError("Please choose a hotel.");
      return;
    }

    if (guestsAdult < 1) {
      setError("At least one adult guest is required.");
      return;
    }

    if (guestsChild < 0) {
      setError("Child guest count cannot be negative.");
      return;
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError("Please choose a valid stay period.");
      return;
    }

    if (nights > 3) {
      setError("Bookings are limited to a maximum of 3 nights.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking(submissionHotelId, session.user.token, {
        startDate: checkIn,
        nights,
        roomNumber,
        guestsAdult,
        guestsChild,
      });
      await update({
        user: {
          ...session.user,
          defaultGuestsAdult: guestsAdult,
          defaultGuestsChild: guestsChild,
        },
      }).catch(() => null);

      router.push("/mybooking?booked=1");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Booking service unavailable.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[62rem]">
      <Link
        href={backHref}
        className="figma-text-action mb-5 inline-flex items-center gap-2 font-figma-copy text-[1.35rem] text-[var(--figma-red)]"
      >
        <span aria-hidden="true">{"<"}</span>
        <span>Go Back</span>
      </Link>

      <div className="grid gap-8 border border-[rgba(171,25,46,0.08)] bg-[rgba(255,245,244,0.42)] p-6 sm:p-10 xl:grid-cols-[1.15fr_0.75fr]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <h1 className="font-figma-nav text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
            COMPLETE BOOKING
          </h1>

          <select
            value={hotel}
            onChange={(event) => setHotel(event.target.value)}
            className="figma-input"
            required
          >
            {hotels.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="number"
              min={1}
              value={guestsAdult}
              onChange={(event) =>
                setGuestsAdult(Math.max(1, Number(event.target.value) || 1))
              }
              className="figma-input"
              placeholder="Adult Guests"
              required
            />

            <input
              type="number"
              min={0}
              value={guestsChild}
              onChange={(event) =>
                setGuestsChild(Math.max(0, Number(event.target.value) || 0))
              }
              className="figma-input"
              placeholder="Child Guests"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(event) => {
                const nextCheckIn = event.target.value;
                setCheckIn(nextCheckIn);
                if (nextCheckIn >= checkOut) {
                  setCheckOut(addDays(nextCheckIn, 1));
                }
              }}
              className="figma-input"
              required
            />

            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(event) => setCheckOut(event.target.value)}
              className="figma-input"
              required
            />
          </div>

          {error ? (
            <p className="figma-feedback figma-feedback-error font-figma-copy text-[1.2rem]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="figma-button figma-button-prominent mt-3 h-14 font-figma-nav text-[1.8rem]"
          >
            {isSubmitting ? "RESERVING" : "RESERVE"}
          </button>
        </form>

        <aside className="space-y-5 border border-[rgba(171,25,46,0.08)] bg-[#fff8f3] p-6">
          <h2 className="font-figma-nav text-[1.7rem] tracking-[0.08em] text-[var(--figma-red)]">
            STAY SUMMARY
          </h2>

          <div className="space-y-3 font-figma-copy text-[1.35rem] text-[var(--figma-ink)]">
            <p>{selectedHotel?.name ?? "Selected hotel"}</p>
            <p>{selectedHotel?.address ?? "Address unavailable"}</p>
            <p>Room {roomNumber}</p>
            <p>
              {guestsAdult} adult{guestsAdult === 1 ? "" : "s"}
              {guestsChild > 0 ? `, ${guestsChild} child${guestsChild === 1 ? "" : "ren"}` : ""}
            </p>
            <p>{session?.user?.email ?? "Log in to confirm this booking"}</p>
          </div>

          <div className="space-y-3 border-t border-[rgba(171,25,46,0.12)] pt-4 font-figma-copy text-[1.35rem] text-[var(--figma-ink)]">
            <div className="flex items-center justify-between gap-4">
              <span>Price :</span>
              <span>${selectedHotel?.price?.toLocaleString() ?? 0}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>night :</span>
              <span>{nights}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Total :</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
