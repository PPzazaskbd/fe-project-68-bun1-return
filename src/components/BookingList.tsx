"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/interface";

function calcNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export default function BookingList() {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.book.bookItems);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px w-16 bg-[#C8881E] opacity-30" />
          <div className="w-10 h-10 border border-[#C8881E] opacity-30 flex items-center justify-center">
            <span style={{ color: "#C8881E", fontSize: "1.2rem" }}>◇</span>
          </div>
          <div className="h-px w-16 bg-[#C8881E] opacity-30" />
        </div>
        <p
          className="text-2xl tracking-wide mb-2"
          style={{ color: "#2A1005", fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
        >
          No Stays Booked Yet
        </p>
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
        >
          Your upcoming hotel stays will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {bookings.map((item: BookingItem, index: number) => {
        const nights = calcNights(item.checkIn, item.checkOut);
        return (
          <div
            key={index}
            className="bg-white p-8 flex items-start justify-between gap-6"
            style={{ border: "1px solid #D4AD7A" }}
          >
            {/* Booking number */}
            <div
              className="text-3xl font-light shrink-0 w-12 text-center"
              style={{ color: "#C8D8E8", fontFamily: "'Cormorant SC', serif" }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Details grid */}
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Guest
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
                >
                  {item.nameLastname}
                </p>
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Contact
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
                >
                  {item.tel}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Hotel
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
                >
                  {item.hotel}
                </p>
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Check-In
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
                >
                  {item.checkIn}
                </p>
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Check-Out
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
                >
                  {item.checkOut}
                </p>
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Duration
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
                >
                  {nights} {nights === 1 ? "Night" : "Nights"}
                </p>
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
                >
                  Guests
                </p>
                <p
                  className="text-lg"
                  style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}
                >
                  {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
            </div>

            {/* Cancel */}
            <button
              onClick={() => dispatch(removeBooking(item))}
              className="shrink-0 px-5 py-2 text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#0D1B2A] hover:text-white"
              style={{
                border: "1px solid #C4973A",
                color: "#C8881E",
                background: "transparent",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Cancel
            </button>
          </div>
        );
      })}
    </div>
  );
}
