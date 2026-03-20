import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FDF6EC" }}>
      <div
        className="py-20 text-center px-6"
        style={{
          background: "linear-gradient(180deg, #130900 0%, #2A1005 100%)",
        }}
      >
        <div className="flex items-center gap-4 justify-center mb-4">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #C8881E)" }} />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif" }}
          >
            Hotel Reservations
          </span>
          <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #C8881E)" }} />
        </div>
        <h1
          className="text-5xl md:text-6xl tracking-wide"
          style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400, color: "#F0D49A" }}
        >
          Book Your Stay
        </h1>
        <p
          className="mt-4 text-lg tracking-wider"
          style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
        >
          Reserve your room for an unforgettable experience
        </p>
      </div>

      <div className="flex justify-center px-6 py-16">
        <Suspense fallback={<div style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Loading...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </main>
  );
}
