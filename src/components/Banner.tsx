"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  {
    label: "Grand Deluxe Suite",
    sublabel: "Suite · King Bed · City View",
    bg: "linear-gradient(135deg, #130900 0%, #2A1005 40%, #5C2E0E 100%)",
  },
  {
    label: "Superior Ocean Room",
    sublabel: "Deluxe · Ocean View · Balcony",
    bg: "linear-gradient(135deg, #2A1005 0%, #5C2E0E 40%, #9C6240 100%)",
  },
  {
    label: "Presidential Villa",
    sublabel: "Villa · Private Pool · Butler Service",
    bg: "linear-gradient(135deg, #130900 0%, #3D1C0A 40%, #6B3A1F 100%)",
  },
];

export default function Banner() {
  const { data: session } = useSession();
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col"
      style={{ background: "#130900" }}
    >
      <div
        className="relative flex-1 min-h-[85vh] flex items-center justify-center cursor-pointer select-none overflow-hidden"
        onClick={handleNext}
        style={{
          background: slides[index].bg,
          transition: "background 0.8s ease",
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(232,184,75,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#C8881E] opacity-70" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#C8881E] opacity-70" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#C8881E] opacity-70" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#C8881E] opacity-70" />

        {/* Inner frame */}
        <div
          className="absolute inset-8 pointer-events-none"
          style={{ border: "1px solid rgba(200,136,30,0.15)" }}
        />

        {/* Welcome badge */}
        {session?.user && (
          <div
            className="absolute top-8 left-1/2 -translate-x-1/2 px-8 py-2"
            style={{
              border: "1px solid rgba(200,136,30,0.5)",
              background: "rgba(19,9,0,0.75)",
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif" }}
            >
              Welcome back, {session.user.name}
            </span>
          </div>
        )}

        {/* Slide counter */}
        <div
          className="absolute top-8 right-24 text-xs tracking-[0.3em]"
          style={{ color: "rgba(200,136,30,0.5)", fontFamily: "'Cormorant SC', serif" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-8 max-w-3xl">
          <div className="flex items-center gap-6 justify-center mb-6">
            <div className="h-px w-24" style={{ background: "linear-gradient(to right, transparent, #C8881E)" }} />
            <span
              className="text-[#C8881E] text-xs tracking-[0.5em] uppercase"
              style={{ fontFamily: "'Cormorant SC', serif" }}
            >
              {slides[index].sublabel}
            </span>
            <div className="h-px w-24" style={{ background: "linear-gradient(to left, transparent, #C8881E)" }} />
          </div>

          <h1
            className="text-6xl md:text-8xl mb-3"
            style={{
              fontFamily: "'Cormorant SC', serif",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "0.05em",
              color: "#F0D49A",
              textShadow: "0 2px 40px rgba(200,136,30,0.3)",
            }}
          >
            {slides[index].label}
          </h1>

          <div className="flex justify-center mb-8">
            <div className="h-px w-32" style={{ background: "linear-gradient(to right, transparent, #C8881E, transparent)" }} />
          </div>

          <p
            className="text-base md:text-lg mb-10 tracking-widest"
            style={{ color: "rgba(240,212,154,0.6)", fontFamily: "'Cormorant SC', serif" }}
          >
            click to explore
          </p>

          <Link href="/venue" onClick={(e) => e.stopPropagation()}>
            <button
              className="px-12 py-4 text-sm tracking-[0.4em] uppercase transition-all"
              style={{
                border: "1px solid rgba(200,136,30,0.7)",
                background: "rgba(200,136,30,0.1)",
                color: "#F0D49A",
                fontFamily: "'Cormorant SC', serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#C8881E";
                (e.currentTarget as HTMLButtonElement).style.color = "#130900";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,136,30,0.1)";
                (e.currentTarget as HTMLButtonElement).style.color = "#F0D49A";
              }}
            >
              Discover Hotels
            </button>
          </Link>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className="transition-all"
              style={{
                width: i === index ? "28px" : "6px",
                height: "6px",
                background: i === index ? "#C8881E" : "rgba(200,136,30,0.3)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors hover:text-[#E8B84B]"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{ color: "rgba(200,136,30,0.5)", fontSize: "1.5rem" }}
        >
          ‹
        </button>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors hover:text-[#E8B84B]"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{ color: "rgba(200,136,30,0.5)", fontSize: "1.5rem" }}
        >
          ›
        </button>
      </div>

      {/* Bottom strip */}
      <div
        className="py-8 px-12 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(200,136,30,0.2)" }}
      >
        <p
          className="text-xs tracking-[0.35em] uppercase"
          style={{ color: "rgba(200,136,30,0.6)", fontFamily: "'Cormorant SC', serif" }}
        >
          Luxury Hotel Collection
        </p>
        <Link href="/booking">
          <span
            className="text-xs tracking-[0.3em] uppercase hover:text-[#E8B84B] transition-colors"
            style={{ color: "rgba(200,136,30,0.6)", fontFamily: "'Cormorant SC', serif" }}
          >
            Book Your Stay →
          </span>
        </Link>
      </div>
    </section>
  );
}
