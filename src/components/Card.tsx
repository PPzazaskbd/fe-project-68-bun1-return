import Link from "next/link";

interface CardProps {
  vid: string;
  name: string;
  address: string;
  province: string;
  dailyrate: number;
}

export default function Card({ vid, name, address, province, dailyrate }: CardProps) {
  return (
    <Link href={`/venue/${vid}`} className="group block">
      <div
        className="overflow-hidden transition-all duration-300 group-hover:shadow-xl"
        style={{ border: "1px solid #C8D8E8" }}
      >
        {/* Image placeholder rectangle */}
        <div
          className="w-full h-64 flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D1B2A 0%, #1B2E42 50%, #2C4A6E 100%)",
          }}
        >
          <div
            className="absolute inset-4"
            style={{ border: "1px dashed rgba(196,151,58,0.25)" }}
          />
          <span
            className="text-xs tracking-[0.3em] uppercase opacity-40 z-10"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            Photo
          </span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ background: "rgba(196,151,58,0.1)" }}
          >
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
            >
              View Hotel
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-6" style={{ background: "#FFFFFF" }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                className="text-xl mb-1 tracking-wide"
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  color: "#0D1B2A",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {name}
              </h2>
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                {province}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-lg"
                style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                ฿{dailyrate?.toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
              >
                / night
              </p>
            </div>
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid #EAF0F6" }}
          >
            <p
              className="text-xs tracking-wide line-clamp-1"
              style={{ color: "#4A7098", fontFamily: "'Cormorant SC', serif" }}
            >
              {address}
            </p>
            <span
              className="text-xs tracking-[0.2em] uppercase group-hover:text-[#C4973A] transition-colors shrink-0 ml-3"
              style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
            >
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
