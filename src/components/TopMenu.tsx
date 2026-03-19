import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4"
      style={{
        background: "#0D1B2A",
        borderBottom: "1px solid rgba(196,151,58,0.2)",
      }}
    >
      {/* LEFT: Auth link */}
      <div>
        {session ? (
          <Link
            href="/api/auth/signout"
            className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#C4973A]"
            style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
          >
            Sign Out
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#C4973A]"
            style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
          >
            Sign In
          </Link>
        )}
      </div>

      {/* CENTER: Brand name */}
      <Link href="/">
        <span
          className="text-2xl tracking-[0.4em] uppercase"
          style={{
            color: "#FAF7F2",
            fontFamily: "'Cormorant SC', serif",
            fontWeight: 500,
            letterSpacing: "0.4em",
          }}
        >
          Bun1
        </span>
      </Link>

      {/* RIGHT: Navigation */}
      <div className="flex items-center gap-8">
        <Link
          href="/venue"
          className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#C4973A]"
          style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
        >
          Hotels
        </Link>
        <Link
          href="/booking"
          className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#C4973A]"
          style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
        >
          Book Stay
        </Link>
        <Link
          href="/mybooking"
          className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#C4973A]"
          style={{ color: "#9BAFC4", fontFamily: "'Cormorant SC', serif" }}
        >
          My Stays
        </Link>
        {session && (
          <span
            className="text-xs tracking-[0.2em]"
            style={{ color: "#C4973A", fontFamily: "'Cormorant SC', serif" }}
          >
            {session.user.name}
          </span>
        )}
      </div>
    </nav>
  );
}
