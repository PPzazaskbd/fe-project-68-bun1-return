"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/interface";
import { useSearchParams } from "next/navigation";

const VENUES = [
  "The Bloom Pavilion",
  "Spark Space",
  "The Grand Table",
  "Garden Terrace",
  "Skyline Suite",
];

export default function BookingForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const preselectedVenue = searchParams.get("venue") || "";

  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [venue, setVenue] = useState(preselectedVenue);
  const [bookDate, setBookDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedVenue) setVenue(preselectedVenue);
  }, [preselectedVenue]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nameLastname || !tel || !venue || !bookDate) {
      setError("Please fill in all fields to complete your reservation.");
      return;
    }

    const newBooking: BookingItem = { nameLastname, tel, venue, bookDate };
    dispatch(addBooking(newBooking));

    setNameLastname("");
    setTel("");
    setVenue("");
    setBookDate("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-lg">
      {success && (
        <div
          className="mb-8 py-4 px-6 text-center"
          style={{
            background: "#F0E8DC",
            border: "1px solid #C4973A",
          }}
        >
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif" }}
          >
            Reservation Confirmed
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            We look forward to hosting your event.
          </p>
        </div>
      )}

      <div
        className="bg-white p-10 shadow-lg"
        style={{ border: "1px solid #E8D5B7" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
          >
            Reservation Form
          </span>
          <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={nameLastname}
              onChange={(e) => setNameLastname(e.target.value)}
              className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
              style={{ fontFamily: "'Cormorant SC', serif" }}
              placeholder="Your full name"
            />
          </div>

          {/* Tel */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
            >
              Contact Number
            </label>
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
              style={{ fontFamily: "'Cormorant SC', serif" }}
              placeholder="Your phone number"
            />
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
            >
              Venue
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              list="venue-options"
              className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
              style={{ fontFamily: "'Cormorant SC', serif" }}
              placeholder="Select or type a venue"
            />
            <datalist id="venue-options">
              {VENUES.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
            >
              Event Date
            </label>
            <input
              type="date"
              value={bookDate}
              min={today}
              onChange={(e) => setBookDate(e.target.value)}
              className="border-b border-[#C4973A] bg-transparent py-2 text-[#1A1208] focus:outline-none focus:border-[#1A1208] transition-colors text-base"
              style={{ fontFamily: "'Cormorant SC', serif" }}
            />
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
              background: "#1A1208",
              fontFamily: "'Cormorant SC', serif",
            }}
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
}
