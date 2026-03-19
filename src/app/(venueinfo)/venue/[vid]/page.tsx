import getVenue from "@/libs/getVenue";
import Link from "next/link";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const venueJson = await getVenue(vid);
  const venue = venueJson.data;

  if (!venue) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <p style={{ fontFamily: "'Cormorant SC', serif", color: "#8B6E52", fontSize: "1.5rem" }}>
          Venue not found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Hero image placeholder */}
      <div
        className="w-full h-[480px] flex items-end justify-start"
        style={{
          background: "linear-gradient(135deg, #2D1B0E 0%, #4A3420 50%, #8B6E52 100%)",
          position: "relative",
        }}
      >
        {/* Placeholder rectangle */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ border: "2px dashed rgba(196,151,58,0.3)" }}
        >
          <span
            className="text-lg tracking-[0.3em] uppercase opacity-40"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            Photo Coming Soon
          </span>
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,18,8,0.9) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 px-12 pb-12">
          <p
            className="text-sm tracking-[0.4em] uppercase mb-2"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            {venue.district} · {venue.province}
          </p>
          <h1
            className="text-5xl md:text-6xl text-white tracking-wide"
            style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}
          >
            {venue.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-16">
        {/* Left: Details */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
            >
              Venue Details
            </span>
            <div className="h-px flex-1 bg-[#C4973A] opacity-30" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="border-b border-[#E8D5B7] pb-4">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Address
              </p>
              <p
                className="text-lg"
                style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif" }}
              >
                {venue.address}
              </p>
            </div>

            <div className="border-b border-[#E8D5B7] pb-4">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Location
              </p>
              <p
                className="text-lg"
                style={{ color: "#1A1208", fontFamily: "'Cormorant SC', serif" }}
              >
                {venue.district}, {venue.province} {venue.postalcode}
              </p>
            </div>

            <div className="border-b border-[#E8D5B7] pb-4">
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
                {venue.tel}
              </p>
            </div>

            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#8B6E52", fontFamily: "'Cormorant SC', serif" }}
              >
                Daily Rate
              </p>
              <p
                className="text-3xl"
                style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                ฿{venue.dailyrate?.toLocaleString()}
                <span
                  className="text-base ml-1"
                  style={{ color: "#8B6E52", fontWeight: 400 }}
                >
                  / day
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Image placeholder + CTA */}
        <div className="flex flex-col gap-6">
          {/* Secondary image placeholder */}
          <div
            className="w-full h-64 flex items-center justify-center"
            style={{
              background: "#F0E8DC",
              border: "1px solid #E8D5B7",
            }}
          >
            <span
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: "#B8963C", fontFamily: "'Cormorant SC', serif" }}
            >
              Interior Preview
            </span>
          </div>

          <Link href={`/booking?venue=${encodeURIComponent(venue.name)}`}>
            <button
              className="w-full py-4 text-white tracking-[0.3em] uppercase text-sm transition-colors hover:opacity-90"
              style={{
                background: "#1A1208",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Reserve This Venue
            </button>
          </Link>

          <Link href="/venue">
            <button
              className="w-full py-3 tracking-[0.3em] uppercase text-sm transition-colors hover:bg-[#F0E8DC]"
              style={{
                border: "1px solid #C4973A",
                color: "#C4973A",
                background: "transparent",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Back to Venues
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
