import getVenue from "@/libs/getVenue";
import Link from "next/link";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const venueJson = await getVenue(vid);
  const hotel = venueJson.data;

  if (!hotel) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <p style={{ fontFamily: "'Cormorant SC', serif", color: "#4A7098", fontSize: "1.5rem" }}>
          Hotel not found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Hero image placeholder */}
      <div
        className="w-full h-[480px] flex items-end justify-start relative"
        style={{
          background: "linear-gradient(135deg, #0D1B2A 0%, #1B2E42 50%, #2C4A6E 100%)",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ border: "2px dashed rgba(196,151,58,0.2)" }}
        >
          <span
            className="text-lg tracking-[0.3em] uppercase opacity-30"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            Photo Coming Soon
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(13,27,42,0.92) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 px-12 pb-12">
          <p
            className="text-sm tracking-[0.4em] uppercase mb-2"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            {hotel.district} · {hotel.province}
          </p>
          <h1
            className="text-5xl md:text-6xl text-white tracking-wide"
            style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
          >
            {hotel.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16">
        {/* Left: Hotel details */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
            >
              Hotel Details
            </span>
            <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="border-b border-[#C8D8E8] pb-4">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                Address
              </p>
              <p
                className="text-lg"
                style={{ color: "#0D1B2A", fontFamily: "'Cormorant SC', serif" }}
              >
                {hotel.address}
              </p>
            </div>

            <div className="border-b border-[#C8D8E8] pb-4">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                Location
              </p>
              <p
                className="text-lg"
                style={{ color: "#0D1B2A", fontFamily: "'Cormorant SC', serif" }}
              >
                {hotel.district}, {hotel.province} {hotel.postalcode}
              </p>
            </div>

            <div className="border-b border-[#C8D8E8] pb-4">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                Reservations
              </p>
              <p
                className="text-lg"
                style={{ color: "#0D1B2A", fontFamily: "'Cormorant SC', serif" }}
              >
                {hotel.tel}
              </p>
            </div>

            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                Rate From
              </p>
              <p
                className="text-3xl"
                style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                ฿{hotel.dailyrate?.toLocaleString()}
                <span
                  className="text-base ml-1"
                  style={{ color: "#4A7098", fontWeight: 400 }}
                >
                  / night
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Room preview + CTA */}
        <div className="flex flex-col gap-6">
          {/* Room image placeholder */}
          <div
            className="w-full h-64 flex items-center justify-center"
            style={{
              background: "#EAF0F6",
              border: "1px solid #C8D8E8",
            }}
          >
            <span
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
            >
              Room Preview
            </span>
          </div>

          <Link href={`/booking?venue=${encodeURIComponent(hotel.name)}`}>
            <button
              className="w-full py-4 text-white tracking-[0.3em] uppercase text-sm transition-colors hover:opacity-90"
              style={{
                background: "#0D1B2A",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Book Your Stay
            </button>
          </Link>

          <Link href="/venue">
            <button
              className="w-full py-3 tracking-[0.3em] uppercase text-sm transition-colors hover:bg-[#EAF0F6]"
              style={{
                border: "1px solid #C4973A",
                color: "#C4973A",
                background: "transparent",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Back to Hotels
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
