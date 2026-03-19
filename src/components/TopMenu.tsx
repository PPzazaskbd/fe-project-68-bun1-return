"use client";

import Link from "next/link";

export default function TopMenu() {
  return (
    <div className="w-full flex justify-between items-center bg-gray-200 px-6 py-3">
      
      {/* LEFT */}
      <div>
        <Link href="/login" className="text-blue-600 font-bold underline hover:text-red-500 transition">
          Sign-In
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* เมนู (เรียงแนวตั้ง) */}
        <div className="bg-gray-300 text-blue-700 font-bold flex flex-col text-sm">
          <Link href="/menu" className="hover:underline">
            Menu Item
          </Link>
          <Link href="/booking" className="hover:underline">
            Booking
          </Link>

          {/* 🔥 เพิ่มตรงนี้ */}
          <Link href="/mybooking" className="hover:underline">
            My Booking
          </Link>
        </div>

        {/* Logo */}
        <div className="bg-yellow-300 px-4 py-2 text-blue-700">
          วาง Logo
        </div>

      </div>

    </div>
  );
}