"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  {
    label: "Grand Deluxe Suite",
    sublabel: "Suite · King Bed · City View",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80",
    overlay: "linear-gradient(135deg, rgba(19,9,0,0.72) 0%, rgba(42,16,5,0.55) 60%, rgba(92,46,14,0.45) 100%)",
  },
  {
    label: "Superior Ocean Room",
    sublabel: "Deluxe · Ocean View · Balcony",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80",
    overlay: "linear-gradient(135deg, rgba(19,9,0,0.65) 0%, rgba(42,16,5,0.5) 60%, rgba(156,98,64,0.4) 100%)",
  },
  {
    label: "Presidential Villa",
    sublabel: "Villa · Private Pool · Butler Service",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
    overlay: "linear-gradient(135deg, rgba(19,9,0,0.70) 0%, rgba(61,28,10,0.55) 60%, rgba(107,58,31,0.45) 100%)",
  },
];

export default function Banner() {
  const { data: session } = useSession();
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full flex flex-col"
      style={{ background: "#130900" }}
    >
      <div
        className="relative flex-1 min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] flex items-center justify-center cursor-pointer select-none overflow-hidden"
        onClick={handleNext}
        style={{ background: "#130900" }}
      >
        {/* Background photo */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === index ? 1 : 0,
              transition: "opacity 1s ease",
              zIndex: 0,
            }}
          >
            <Image
              src={slide.image}
              alt={slide.label}
              fill
              priority={i === 0}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ))}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: slides[index].overlay, transition: "background 0.8s ease", zIndex: 1 }}
        />

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(232,184,75,0.08) 0%, transparent 70%)",
            zIndex: 2,
          }}
        />

        {/* Corner ornaments — smaller on mobile */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-[#C8881E] opacity-70 z-10" />
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-[#C8881E] opacity-70 z-10" />
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-[#C8881E] opacity-70 z-10" />
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-[#C8881E] opacity-70 z-10" />

        {/* Inner frame */}
        <div
          className="absolute inset-4 sm:inset-8 pointer-events-none z-10"
          style={{ border: "1px solid rgba(200,136,30,0.15)" }}
        />

        {/* Welcome badge */}
        {session?.user && (
          <div
            className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 px-4 sm:px-8 py-2 z-10 whitespace-nowrap"
            style={{
              border: "1px solid rgba(200,136,30,0.5)",
              background: "rgba(19,9,0,0.75)",
            }}
          >
            <span
              className="text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase"
              style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif" }}
            >
              Welcome back, {session.user.name}
            </span>
          </div>
        )}

        {/* Slide counter */}
        <div
          className="absolute top-4 sm:top-8 right-16 sm:right-24 text-xs tracking-[0.3em] z-10"
          style={{ color: "rgba(200,136,30,0.5)", fontFamily: "'Cormorant SC', serif" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-6 sm:px-8 max-w-xs sm:max-w-xl md:max-w-3xl w-full">
          <div className="flex items-center gap-3 sm:gap-6 justify-center mb-4 sm:mb-6">
            <div className="h-px w-10 sm:w-24" style={{ background: "linear-gradient(to right, transparent, #C8881E)" }} />
            <span
              className="text-[#C8881E] text-xs tracking-[0.3em] sm:tracking-[0.5em] uppercase"
              style={{ fontFamily: "'Cormorant SC', serif" }}
            >
              {slides[index].sublabel}
            </span>
            <div className="h-px w-10 sm:w-24" style={{ background: "linear-gradient(to left, transparent, #C8881E)" }} />
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-8xl mb-3"
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

          <div className="flex justify-center mb-5 sm:mb-8">
            <div className="h-px w-24 sm:w-32" style={{ background: "linear-gradient(to right, transparent, #C8881E, transparent)" }} />
          </div>

          <p
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-10 tracking-widest"
            style={{ color: "rgba(240,212,154,0.6)", fontFamily: "'Cormorant SC', serif" }}
          >
            tap to explore
          </p>

          <Link href="/venue" onClick={(e) => e.stopPropagation()}>
            <button
              className="px-8 sm:px-12 py-3 sm:py-4 text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase transition-all"
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
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
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
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors hover:text-[#E8B84B] z-10"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{ color: "rgba(200,136,30,0.5)", fontSize: "1.5rem" }}
        >
          ‹
        </button>
        <button
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors hover:text-[#E8B84B] z-10"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{ color: "rgba(200,136,30,0.5)", fontSize: "1.5rem" }}
        >
          ›
        </button>
      </div>

      {/* Bottom strip */}
      <div
        className="py-5 sm:py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0"
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
