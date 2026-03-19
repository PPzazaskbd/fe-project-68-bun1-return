"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/interface";

export default function BookingList() {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.book.bookItems);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px w-16 bg-[#C4973A] opacity-30" />
          <div
            className="w-10 h-10 border border-[#C4973A] opacity-30 flex items-center justify-center"
          >
            <span style={{ color: "#C4973A", fontSize: "1.2rem" }}>◇</span>
          </div>
          <div className="h-px w-16 bg-[#C4973A] opacity-30" />
        </div>
        <p
          className="text-2xl tracking-wide mb-2"
          style={{ color: "#4A3420", fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
        >
          No Reservations Yet
        </p>
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
        >
          Your upcoming bookings will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {bookings.map((item: BookingItem, index: number) => (
        <div
          key={index}
          className="bg-white p-8 flex items-start justify-between gap-6"
          style={{ border: "1px solid #E8D5B7" }}
        >
          {/* Left: Booking number */}
          <div
            className="text-3xl font-light shrink-0 w-12 text-center"
            style={{ color: "#E8D5B7", fontFamily: "'Cormorant SC', serif" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Center: Details */}
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Guest
              </p>
              <p
                className="text-lg"
                style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                {item.nameLastname}
              </p>
            </div>

            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Contact
              </p>
              <p
                className="text-lg"
                style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif" }}
              >
                {item.tel}
              </p>
            </div>

            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Venue
              </p>
              <p
                className="text-lg"
                style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                {item.venue}
              </p>
            </div>

            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Date
              </p>
              <p
                className="text-lg"
                style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif" }}
              >
                {item.bookDate}
              </p>
            </div>
          </div>

          {/* Right: Cancel button */}
          <button
            onClick={() => dispatch(removeBooking(item))}
            className="shrink-0 px-5 py-2 text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#1A1208] hover:text-white"
            style={{
              border: "1px solid #C4973A",
              color: "#C4973A",
              background: "transparent",
              fontFamily: "'Cormorant SC', serif",
            }}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
