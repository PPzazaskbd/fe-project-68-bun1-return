import BookingList from "@/components/BookingList";

export default function MyBookingPage() {
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
            My Account
          </span>
          <div className="h-px w-16 bg-[#C4973A] opacity-60" />
        </div>
        <h1
          className="text-5xl md:text-6xl tracking-wide text-white"
          style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
        >
          My Bookings
        </h1>
        <p
          className="mt-4 text-lg tracking-wider"
          style={{ color: "#B8963C", fontFamily: "'Cormorant SC', serif" }}
        >
          Your upcoming reservations
        </p>
      </div>

      {/* Bookings list */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <BookingList />
      </div>
    </main>
  );
}
