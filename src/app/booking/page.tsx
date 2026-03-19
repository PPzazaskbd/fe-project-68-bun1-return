import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Header */}
      <div
        className="py-20 text-center px-6"
        style={{
          background: "linear-gradient(180deg, #1A1208 0%, #2D1B0E 100%)",
        }}
      >
        <div className="flex items-center gap-4 justify-center mb-4">
          <div className="h-px w-16 bg-[#C4973A] opacity-60" />
          <span
            className="text-[#C4973A] text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Cormorant SC', serif" }}
          >
            Reservations
          </span>
          <div className="h-px w-16 bg-[#C4973A] opacity-60" />
        </div>
        <h1
          className="text-5xl md:text-6xl tracking-wide text-white"
          style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
        >
          Book a Venue
        </h1>
        <p
          className="mt-4 text-lg tracking-wider"
          style={{ color: "#B8963C", fontFamily: "'Cormorant SC', serif" }}
        >
          Reserve your perfect space for an unforgettable event
        </p>
      </div>

      {/* Form */}
      <div className="flex justify-center px-6 py-16">
        <Suspense fallback={<div style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}>Loading...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </main>
  );
}
