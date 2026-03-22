"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { BookingItem, HotelItem } from "@/interface";
import {
  calculateNights,
  getTodayIsoDate,
  loadBookings,
  saveBookings,
} from "@/libs/bookingStorage";
import { buildDateRangeHref, getDateRangeFromSearchParams } from "@/libs/dateRangeParams";

interface BookingFormProps {
  hotels: HotelItem[];
}

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function BookingForm({ hotels }: BookingFormProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const today = getTodayIsoDate();
  const defaultCheckOut = addDays(today, 1);
  const initialHotel = hotels[0]?.name ?? "";
  const dateRange = getDateRangeFromSearchParams(searchParams, today);

  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [hotel, setHotel] = useState(initialHotel);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setNameLastname((current) => current || session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    const venue = searchParams.get("venue");
    const from = searchParams.get("checkIn");
    const to = searchParams.get("checkOut");

    if (venue) {
      const decodedVenue = decodeURIComponent(venue);
      const matchedHotel = hotels.find(
        (item) => item.name.toLowerCase() === decodedVenue.toLowerCase(),
      );
      setHotel(matchedHotel?.name ?? decodedVenue);
    }

    if (from) setCheckIn(from);
    if (to) setCheckOut(to);
  }, [hotels, searchParams]);

  const selectedHotel = useMemo(
    () => hotels.find((item) => item.name === hotel),
    [hotel, hotels],
  );
  const backHref = useMemo(() => {
    const hotelId = searchParams.get("hotelId");

    if (hotelId) {
      return buildDateRangeHref(`/venue/${encodeURIComponent(hotelId)}`, dateRange);
    }

    const venue = searchParams.get("venue");

    if (!venue) {
      return buildDateRangeHref("/venue", dateRange);
    }

    const decodedVenue = decodeURIComponent(venue);
    const matchedHotel = hotels.find(
      (item) => item.name.toLowerCase() === decodedVenue.toLowerCase(),
    );
    const matchedHotelId = matchedHotel?.id || matchedHotel?._id;

    return matchedHotelId
      ? buildDateRangeHref(`/venue/${encodeURIComponent(matchedHotelId)}`, dateRange)
      : buildDateRangeHref("/venue", dateRange);
  }, [dateRange, hotels, searchParams]);

  const nights = Math.max(1, calculateNights(checkIn, checkOut));
  const total = (selectedHotel?.price ?? 0) * nights;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!nameLastname.trim()) {
      setError("Please enter the guest name.");
      return;
    }

    if (!tel.trim()) {
      setError("Please enter a contact number.");
      return;
    }

    if (!/^\d+$/.test(tel)) {
      setError("Contact number must contain digits only.");
      return;
    }

    if (!hotel) {
      setError("Please choose a hotel.");
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

    const newBooking: BookingItem = {
      id: Date.now().toString(),
      nameLastname: nameLastname.trim(),
      tel: tel.trim(),
      hotel,
      checkIn,
      checkOut,
      guests,
      userEmail: session?.user?.email || "",
    };

    const existingBookings = loadBookings();
    saveBookings([...existingBookings, newBooking]);

    setSuccess(true);
    setError("");
    setGuests(1);
    setCheckIn(today);
    setCheckOut(defaultCheckOut);
    setHotel(initialHotel);
    setTimeout(() => setSuccess(false), 4000);
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

      {success ? (
        <div className="figma-feedback figma-feedback-success mb-6 px-6 py-4">
          <p className="font-figma-nav text-[1.35rem] tracking-[0.08em]">
            BOOKING CONFIRMED
          </p>
          <p className="mt-1 font-figma-copy text-[1.25rem]">
            Your reservation was stored successfully.
          </p>
        </div>
      ) : null}

      <div className="grid gap-8 border border-[rgba(171,25,46,0.08)] bg-[rgba(255,245,244,0.42)] p-6 sm:p-10 xl:grid-cols-[1.15fr_0.75fr]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <h1 className="font-figma-nav text-[2rem] tracking-[0.08em] text-[var(--figma-red)]">
            COMPLETE BOOKING
          </h1>

          <input
            type="text"
            value={nameLastname}
            onChange={(event) => setNameLastname(event.target.value.replace(/\d/g, ""))}
            className="figma-input"
            placeholder="Guest Name"
            required
          />

          <input
            type="tel"
            value={tel}
            onChange={(event) => setTel(event.target.value.replace(/\D/g, ""))}
            className="figma-input"
            placeholder="Phone Number"
            required
          />

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

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGuests((current) => Math.max(1, current - 1))}
              className="figma-button-secondary flex h-10 w-10 items-center justify-center text-[1.5rem]"
            >
              -
            </button>
            <span className="font-figma-copy text-[1.5rem] text-[var(--figma-ink)]">
              {guests} guest{guests > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setGuests((current) => Math.min(10, current + 1))}
              className="figma-button-secondary flex h-10 w-10 items-center justify-center text-[1.5rem]"
            >
              +
            </button>
          </div>

          {error ? (
            <p className="figma-feedback figma-feedback-error font-figma-copy text-[1.2rem]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="figma-button figma-button-prominent mt-3 h-14 font-figma-nav text-[1.8rem]"
          >
            RESERVE
          </button>
        </form>

        <aside className="space-y-5 border border-[rgba(171,25,46,0.08)] bg-[#fff8f3] p-6">
          <h2 className="font-figma-nav text-[1.7rem] tracking-[0.08em] text-[var(--figma-red)]">
            STAY SUMMARY
          </h2>

          <div className="space-y-3 font-figma-copy text-[1.35rem] text-[var(--figma-ink)]">
            <p>{selectedHotel?.name ?? "Selected hotel"}</p>
            <p>{selectedHotel?.address ?? "Address unavailable"}</p>
            <p>{selectedHotel?.tel ?? "Phone unavailable"}</p>
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
