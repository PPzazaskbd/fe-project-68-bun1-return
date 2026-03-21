"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLink =
  "text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]";
const navStyle = { color: "#C4956A", fontFamily: "'Cormorant SC', serif" };

export default function TopMenu() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
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
        {/* Left: sign in / register / sign out */}
        <div className="hidden sm:flex items-center gap-4 min-w-[80px]">
          {session ? (
            <button
              onClick={() => signOut()}
              className={`${navLink} bg-transparent border-none cursor-pointer`}
              style={navStyle}
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className={navLink} style={navStyle}>Sign In</Link>
              <span style={{ color: "#5C2E0E" }}>|</span>
              <Link href="/register" className={navLink} style={navStyle}>Register</Link>
            </>
          )}
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/Bun_JS_logo.png" alt="Bun" width={24} height={24} className="sm:w-7 sm:h-7" />
          <span
            className="text-xl sm:text-2xl tracking-[0.4em] uppercase"
            style={{ color: "#F0D49A", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}
          >
            Bun1
          </span>
        </Link>

        {/* Right: nav links + hamburger */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden sm:flex items-center gap-6 md:gap-8">
            <Link href="/venue" className={navLink} style={navStyle}>Hotels</Link>
            <Link href="/booking" className={navLink} style={navStyle}>Book Stay</Link>
            <Link href="/mybooking" className={navLink} style={navStyle}>My Stays</Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={navLink}
                style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif" }}
              >
                Admin
              </Link>
            )}
            {session && (
              <span className="text-xs tracking-[0.2em]" style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif" }}>
                {session.user?.name}
              </span>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-px transition-all" style={{ background: "#C4956A", transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none" }} />
            <span className="block w-6 h-px transition-all" style={{ background: "#C4956A", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-px transition-all" style={{ background: "#C4956A", transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-0" style={{ background: "#1a0d02", borderTop: "1px solid rgba(200,136,30,0.15)" }}>
          {[
            { href: "/venue", label: "Hotels" },
            { href: "/booking", label: "Book Stay" },
            { href: "/mybooking", label: "My Stays" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif", borderBottom: "1px solid rgba(200,136,30,0.1)" }}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
              style={{ color: "#E8B84B", fontFamily: "'Cormorant SC', serif", borderBottom: "1px solid rgba(200,136,30,0.1)" }}
            >
              Admin
            </Link>
          )}
          {session ? (
            <button
              onClick={() => { setMenuOpen(false); signOut(); }}
              className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B] text-left bg-transparent border-none cursor-pointer"
              style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif", borderBottom: "1px solid rgba(200,136,30,0.1)" }}
            >
              Sign Out {session.user?.name ? `(${session.user.name})` : ""}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
                style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif", borderBottom: "1px solid rgba(200,136,30,0.1)" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-xs tracking-[0.3em] uppercase transition-colors hover:text-[#E8B84B]"
                style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
