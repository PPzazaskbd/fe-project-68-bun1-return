import Link from "next/link";
import Image from "next/image";

interface CardProps {
  vid: string;
  name: string;
  address: string;
  province: string;
  dailyrate: number;
  picture?: string;
}

export default function Card({ vid, name, address, province, dailyrate, picture }: CardProps) {
  return (
    <Link href={`/venue/${vid}`} className="group block">
      <div
        className="overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
        style={{ border: "1px solid #D4AD7A" }}
      >
        <div className="w-full h-64 relative overflow-hidden">
          {picture ? (
            <Image
              src={picture}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2A1005 0%, #5C2E0E 50%, #9C6240 100%)" }}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase opacity-40"
                style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif" }}
              >
                Photo
              </span>
            </div>
          )}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
            style={{ background: "linear-gradient(to top, rgba(19,9,0,0.7) 0%, transparent 60%)" }}
          >
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif" }}
            >
              View Hotel
            </span>
          </div>
        </div>

        <div className="p-6" style={{ background: "#FFFDF8" }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                className="text-xl mb-1 tracking-wide"
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  color: "#130900",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {name}
              </h2>
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
              >
                {province}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-lg"
                style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
              >
                ฿{dailyrate?.toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
              >
                / night
              </p>
            </div>
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid #F2E4C8" }}
          >
            <p
              className="text-xs tracking-wide line-clamp-1"
              style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
            >
              {address}
            </p>
            <span
              className="text-xs tracking-[0.2em] uppercase group-hover:text-[#C8881E] transition-colors shrink-0 ml-3"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
