"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/interface";
import { useSearchParams } from "next/navigation";
import hotels from "@/data/hotels";

const hotelNames = hotels.data.map((h) => h.name);

export default function BookingForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const preselectedHotel = searchParams.get("venue") || "";

  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [hotel, setHotel] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedHotel) {
      const decoded = decodeURIComponent(preselectedHotel);
      // Match by exact name or closest match (case-insensitive)
      const matched = hotelNames.find(
        (n) => n.toLowerCase() === decoded.toLowerCase()
      );
      setHotel(matched || decoded);
    }
  }, [preselectedHotel]);

  const today = new Date().toISOString().split("T")[0];

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nameLastname.trim() || !tel.trim() || !hotel || !checkIn || !checkOut) {
      setError("Please fill in all fields to complete your reservation.");
      return;
    }
    if (!hotelNames.includes(hotel)) {
      setError("Please select a valid hotel from the list.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    const newBooking: BookingItem = { nameLastname, tel, hotel, checkIn, checkOut, guests };
    dispatch(addBooking(newBooking));

    setNameLastname("");
    setTel("");
    setHotel("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const nights = calcNights();

  const inputClass =
    "border-b border-[#C8881E] bg-transparent py-2 text-[#130900] focus:outline-none focus:border-[#130900] transition-colors text-base w-full";
  const labelClass =
    "text-xs tracking-[0.2em] uppercase";

  return (
    <div className="w-full max-w-lg">
      {success && (
        <div
          className="mb-8 py-4 px-6 text-center"
          style={{ background: "#F2E4C8", border: "1px solid #C8881E" }}
        >
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
          >
            Booking Confirmed
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
          >
            We look forward to welcoming you.
          </p>
        </div>
      )}

      <div
        className="bg-white p-10 shadow-lg"
        style={{ border: "1px solid #D4AD7A" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#C8881E] opacity-30" />
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
          >
            Hotel Reservation
          </span>
          <div className="h-px flex-1 bg-[#C8881E] opacity-30" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label
              className={labelClass}
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              Guest Name
            </label>
            <input
              type="text"
              value={nameLastname}
              onChange={(e) => setNameLastname(e.target.value)}
              className={inputClass}
              style={{ fontFamily: "'Cormorant SC', serif" }}
              placeholder="Full name"
            />
          </div>

          {/* Tel */}
          <div className="flex flex-col gap-1">
            <label
              className={labelClass}
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              Contact Number
            </label>
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className={inputClass}
              style={{ fontFamily: "'Cormorant SC', serif" }}
              placeholder="Phone number"
            />
          </div>

          {/* Hotel — dropdown from list */}
          <div className="flex flex-col gap-1">
            <label
              className={labelClass}
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              Hotel
            </label>
            <select
              value={hotel}
              onChange={(e) => setHotel(e.target.value)}
              className={inputClass}
              style={{ fontFamily: "'Cormorant SC', serif", cursor: "pointer" }}
            >
              <option value="" disabled>
                Select a hotel
              </option>
              {hotelNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Check-in / Check-out row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
              >
                Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && checkOut <= e.target.value) setCheckOut("");
                }}
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className={labelClass}
                style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
              >
                Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputClass}
                style={{ fontFamily: "'Cormorant SC', serif" }}
              />
            </div>
          </div>

          {/* Nights summary */}
          {nights > 0 && (
            <div
              className="py-3 px-4 flex items-center justify-between"
              style={{ background: "#F2E4C8" }}
            >
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
              >
                Duration
              </span>
              <span
                className="text-sm"
                style={{ color: "#130900", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>
          )}

          {/* Guests */}
          <div className="flex flex-col gap-1">
            <label
              className={labelClass}
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              Guests
            </label>
            <div className="flex items-center gap-4 border-b border-[#C8881E] py-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-7 h-7 flex items-center justify-center transition-colors hover:text-[#E8B84B]"
                style={{ color: "#9C6240", border: "1px solid #D4AD7A", fontFamily: "'Cormorant SC', serif" }}
              >
                −
              </button>
              <span
                className="flex-1 text-center text-base"
                style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
              >
                {guests} {guests === 1 ? "Guest" : "Guests"}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(10, g + 1))}
                className="w-7 h-7 flex items-center justify-center transition-colors hover:text-[#E8B84B]"
                style={{ color: "#9C6240", border: "1px solid #D4AD7A", fontFamily: "'Cormorant SC', serif" }}
              >
                +
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-sm"
              style={{ color: "#8B3A3A", fontFamily: "'Cormorant SC', serif" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 py-4 text-white tracking-[0.4em] uppercase text-sm transition-opacity hover:opacity-80"
            style={{
              background: "#130900",
              fontFamily: "'Cormorant SC', serif",
            }}
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
