"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function TopMenu() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="w-full relative"
      style={{
        background: "#130900",
        borderBottom: "1px solid rgba(200,136,30,0.25)",
      }}
    >
      {/* Main row */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
        {/* Left: sign in/out (hidden on mobile, shown on sm+) */}
        <div className="hidden sm:block min-w-[80px]">
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B] bg-transparent border-none cursor-pointer"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/Bun_JS_logo.png" alt="Bun" width={24} height={24} className="sm:w-7 sm:h-7" />
          <span
            className="text-xl sm:text-2xl tracking-[0.4em] uppercase"
            style={{
              color: "#F0D49A",
              fontFamily: "'Cormorant SC', serif",
              fontWeight: 500,
              letterSpacing: "0.4em",
            }}
          >
            Bun1
          </span>
        </Link>

        {/* Right: nav links (hidden on mobile) + hamburger */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden sm:flex items-center gap-6 md:gap-8">
            <Link
              href="/venue"
              className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              Hotels
            </Link>
            <Link
              href="/booking"
              className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              Book Stay
            </Link>
            <Link
              href="/mybooking"
              className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
            >
              My Stays
            </Link>
            {session && (
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif" }}
              >
                {session.user?.name}
              </span>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-px transition-all"
              style={{
                background: "#C4956A",
                transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none",
              }}
            />
            <span
              className="block w-6 h-px transition-all"
              style={{
                background: "#C4956A",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-all"
              style={{
                background: "#C4956A",
                transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="sm:hidden flex flex-col gap-0"
          style={{
            background: "#1a0d02",
            borderTop: "1px solid rgba(200,136,30,0.15)",
          }}
        >
          <Link
            href="/venue"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
            style={{
              color: "#C4956A",
              fontFamily: "'Cormorant SC', serif",
              borderBottom: "1px solid rgba(200,136,30,0.1)",
            }}
          >
            Hotels
          </Link>
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
            style={{
              color: "#C4956A",
              fontFamily: "'Cormorant SC', serif",
              borderBottom: "1px solid rgba(200,136,30,0.1)",
            }}
          >
            Book Stay
          </Link>
          <Link
            href="/mybooking"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
            style={{
              color: "#C4956A",
              fontFamily: "'Cormorant SC', serif",
              borderBottom: "1px solid rgba(200,136,30,0.1)",
            }}
          >
            My Stays
          </Link>
          {session ? (
            <button
              onClick={() => { setMenuOpen(false); signOut(); }}
              className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B] text-left bg-transparent border-none cursor-pointer"
              style={{
                color: "#C4956A",
                fontFamily: "'Cormorant SC', serif",
                borderBottom: "1px solid rgba(200,136,30,0.1)",
              }}
            >
              Sign Out {session.user?.name ? `(${session.user.name})` : ""}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{
                color: "#C4956A",
                fontFamily: "'Cormorant SC', serif",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
