import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions).catch(() => null);

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4"
      style={{
        background: "#130900",
        borderBottom: "1px solid rgba(200,136,30,0.25)",
      }}
    >
      <div>
        {session ? (
          <Link
            href="/api/auth/signout"
            className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-[#E8B84B]"
            style={{ color: "#C4956A", fontFamily: "'Cormorant SC', serif" }}
          >
            Sign Out
          </Link>
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

      <Link href="/">
        <span
          className="text-2xl tracking-[0.4em] uppercase"
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

      <div className="flex items-center gap-8">
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
            {session.user.name}
          </span>
        )}
      </div>
    </nav>
  );
}
