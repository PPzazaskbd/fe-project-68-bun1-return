import getVenue from "@/libs/getVenue";
import Link from "next/link";
import Image from "next/image";

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
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FDF6EC" }}>
        <p style={{ fontFamily: "'Cormorant SC', serif", color: "#9C6240", fontSize: "1.5rem" }}>
          Hotel not found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FDF6EC" }}>
      {/* Hero */}
      <div className="w-full h-[260px] sm:h-[380px] md:h-[480px] flex items-end justify-start relative overflow-hidden">
        {hotel.picture ? (
          <Image
            src={hotel.picture}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #130900 0%, #2A1005 50%, #5C2E0E 100%)" }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(19,9,0,0.88) 0%, rgba(19,9,0,0.2) 60%, transparent 100%)" }}
        />
        <div className="relative z-10 px-5 sm:px-12 pb-6 sm:pb-12">
          <p
            className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-1 sm:mb-2"
            style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif" }}
          >
            {hotel.district} · {hotel.province}
          </p>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl tracking-wide"
            style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400, color: "#F0D49A" }}
          >
            {hotel.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
        {/* Left: Hotel details */}
        <div>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(200,136,30,0.3)" }} />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              Hotel Details
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(200,136,30,0.3)" }} />
          </div>

          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="border-b pb-4" style={{ borderColor: "#D4AD7A" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
                Address
              </p>
              <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>
                {hotel.address}
              </p>
            </div>

            <div className="border-b pb-4" style={{ borderColor: "#D4AD7A" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
                Location
              </p>
              <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>
                {hotel.district}, {hotel.province} {hotel.postalcode}
              </p>
            </div>

            <div className="border-b pb-4" style={{ borderColor: "#D4AD7A" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
                Reservations
              </p>
              <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>
                {hotel.tel}
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
                Rate From
              </p>
              <p className="text-2xl sm:text-3xl" style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}>
                ฿{hotel.dailyrate?.toLocaleString()}
                <span className="text-base ml-1" style={{ color: "#9C6240", fontWeight: 400 }}>
                  / night
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <div
            className="w-full h-48 sm:h-64 relative overflow-hidden"
            style={{ border: "1px solid #D4AD7A" }}
          >
            {hotel.picture && (
              <Image
                src={hotel.picture}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          <Link href={`/booking?venue=${encodeURIComponent(hotel.name)}`}>
            <button
              className="w-full py-3 sm:py-4 tracking-[0.3em] uppercase text-sm transition-all hover:opacity-90"
              style={{
                background: "#C8881E",
                color: "#130900",
                fontFamily: "'Cormorant SC', serif",
                fontWeight: 600,
              }}
            >
              Book Your Stay
            </button>
          </Link>

          <Link href="/venue">
            <button
              className="w-full py-3 tracking-[0.3em] uppercase text-sm transition-colors"
              style={{
                border: "1px solid #C8881E",
                color: "#C8881E",
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
