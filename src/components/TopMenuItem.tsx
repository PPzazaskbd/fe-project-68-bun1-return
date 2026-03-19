"use client";

import Link from "next/link";

export default function TopMenu() {
  return (
    <div className="w-full flex justify-between items-center bg-gray-200 px-6 py-3">
      
      {/* LEFT */}
      <div>
        <Link href="/login" className="font-bold underline">
          Sign-In
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <Link href="/booking" className="font-semibold">
          Booking
        </Link>

        <div className="bg-yellow-200 px-4 py-2">
          Logo
        </div>
      </div>

    </div>
  );
}