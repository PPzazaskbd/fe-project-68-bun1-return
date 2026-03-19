"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  {
    label: "The Grand Pavilion",
    sublabel: "Ballroom · 800 Guests",
  },
  {
    label: "Garden Terrace",
    sublabel: "Outdoor · 300 Guests",
  },
  {
    label: "Skyline Suite",
    sublabel: "Rooftop · 150 Guests",
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
      style={{ background: "#1A1208" }}
    >
      {/* Main hero image placeholder */}
      <div
        className="relative flex-1 min-h-[85vh] flex items-center justify-center cursor-pointer select-none overflow-hidden"
        onClick={handleNext}
        style={{
          background: `linear-gradient(135deg, #1A1208 0%, #2D1B0E ${30 + index * 10}%, #4A3420 70%, #8B6E52 100%)`,
          transition: "background 0.8s ease",
        }}
      >
        {/* Dashed placeholder border */}
        <div
          className="absolute inset-8 pointer-events-none"
          style={{ border: "1px dashed rgba(196,151,58,0.2)" }}
        />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#C4973A] opacity-60" />
        <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#C4973A] opacity-60" />
        <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#C4973A] opacity-60" />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#C4973A] opacity-60" />

        {/* Welcome badge */}
        {session?.user && (
          <div
            className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2"
            style={{
              border: "1px solid rgba(196,151,58,0.4)",
              background: "rgba(26,18,8,0.7)",
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
            >
              Welcome, {session.user.name}
            </span>
          </div>
        )}

        {/* Slide indicator */}
        <div
          className="absolute top-8 right-24 text-xs tracking-[0.3em]"
          style={{ color: "rgba(196,151,58,0.5)", fontFamily: "'Cormorant SC', serif" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-8 max-w-3xl">
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px w-20 bg-[#C4973A] opacity-50" />
            <span
              className="text-[#C4973A] text-xs tracking-[0.5em] uppercase"
              style={{ fontFamily: "'Cormorant SC', serif" }}
            >
              {slides[index].sublabel}
            </span>
            <div className="h-px w-20 bg-[#C4973A] opacity-50" />
          </div>

          <h1
            className="text-6xl md:text-8xl text-white mb-8"
            style={{
              fontFamily: "'Cormorant SC', serif",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "0.05em",
            }}
          >
            {slides[index].label}
          </h1>

          <p
            className="text-lg md:text-xl mb-10 tracking-widest"
            style={{ color: "rgba(184,150,60,0.8)", fontFamily: "'Cormorant SC', serif" }}
          >
            click to explore
          </p>

          <Link href="/venue" onClick={(e) => e.stopPropagation()}>
            <button
              className="px-12 py-4 text-white text-sm tracking-[0.4em] uppercase transition-all hover:bg-[#C4973A]"
              style={{
                border: "1px solid rgba(196,151,58,0.6)",
                background: "transparent",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Explore Venues
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
                width: i === index ? "24px" : "6px",
                height: "6px",
                background: i === index ? "#C4973A" : "rgba(196,151,58,0.3)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Prev arrow */}
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors hover:text-[#C4973A]"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{ color: "rgba(196,151,58,0.5)", fontSize: "1.5rem" }}
        >
          ‹
        </button>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-colors hover:text-[#C4973A]"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{ color: "rgba(196,151,58,0.5)", fontSize: "1.5rem" }}
        >
          ›
        </button>
      </div>

      {/* Bottom strip */}
      <div
        className="py-8 px-12 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(196,151,58,0.15)" }}
      >
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(184,150,60,0.6)", fontFamily: "'Cormorant SC', serif" }}
        >
          Premium Venue Collection
        </p>
        <Link href="/booking">
          <span
            className="text-xs tracking-[0.3em] uppercase hover:text-[#C4973A] transition-colors"
            style={{ color: "rgba(184,150,60,0.6)", fontFamily: "'Cormorant SC', serif" }}
          >
            Make a Reservation →
          </span>
        </Link>
      </div>
    </section>
  );
}
