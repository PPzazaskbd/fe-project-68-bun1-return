import BookingList from "@/components/BookingList";

export default function MyStaysPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FDF6EC" }}>
      <div
        className="py-12 sm:py-20 text-center px-4 sm:px-6"
        style={{
          background: "linear-gradient(180deg, #130900 0%, #2A1005 100%)",
        }}
      >
        <div className="flex items-center gap-3 sm:gap-4 justify-center mb-4">
          <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to right, transparent, #C8881E)" }} />
          <span
            className="text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase"
            style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif" }}
          >
            My Account
          </span>
          <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to left, transparent, #C8881E)" }} />
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl tracking-wide"
          style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400, color: "#F0D49A" }}
        >
          My Stays
        </h1>
        <p
          className="mt-3 sm:mt-4 text-base sm:text-lg tracking-wider"
          style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
        >
          Your upcoming hotel reservations
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <BookingList />
      </div>
    </main>
  );
}
