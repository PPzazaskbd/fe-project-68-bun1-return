"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HotelItem } from "@/interface";
import DateRangeToolbar from "./DateRangeToolbar";
import Arrow from "./Arrow";
import { calculateNights, getTodayIsoDate } from "@/libs/bookingStorage";
import {
  buildDateRangeHref,
  createDateRangeSearchParams,
  getDateRangeFromSearchParams,
  normalizeDateRange,
} from "@/libs/dateRangeParams";

interface HotelDetailClientProps {
  hotel: HotelItem;
}

export default function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = getTodayIsoDate();
  const urlDateRange = getDateRangeFromSearchParams(searchParams, today);
  const [fromDate, setFromDate] = useState(urlDateRange.checkIn);
  const [toDate, setToDate] = useState(urlDateRange.checkOut);
  const hotelId = hotel.id || hotel._id;
  const nights = Math.max(1, calculateNights(fromDate, toDate));
  const total = hotel.price * nights;

  useEffect(() => {
    setFromDate(urlDateRange.checkIn);
    setToDate(urlDateRange.checkOut);
  }, [urlDateRange.checkIn, urlDateRange.checkOut]);

  const syncDateRange = (nextCheckIn: string, nextCheckOut: string) => {
    const normalizedRange = normalizeDateRange(nextCheckIn, nextCheckOut, today);

    setFromDate(normalizedRange.checkIn);
    setToDate(normalizedRange.checkOut);

    const nextSearchParams = createDateRangeSearchParams(
      searchParams,
      normalizedRange,
    );

    router.replace(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <main className="figma-page py-6 sm:py-8">
      <div className="figma-shell">
        <DateRangeToolbar
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(value) => {
            syncDateRange(value, toDate);
          }}
          onToDateChange={(value) => {
            syncDateRange(fromDate, value);
          }}
        />

        <section className="mt-8 border border-[rgba(171,25,46,0.08)] bg-[rgba(255,245,244,0.45)] p-5 sm:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.86fr]">
            <div>
              <div className="aspect-[896/400] overflow-hidden bg-[#efe3d8]">
                {hotel.imgSrc ? (
                  <img
                    src={hotel.imgSrc}
                    alt={hotel.name}
                    fetchPriority="high"
                    className="block h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-figma-copy text-[2rem] text-[var(--figma-ink-soft)]">
                    Some photo
                  </div>
                )}
              </div>

              <h1 className="mt-6 font-figma-copy text-[2.7rem] leading-none text-[var(--figma-ink)] sm:text-[3.75rem]">
                {hotel.name}
              </h1>

              <p className="mt-4 max-w-[56rem] font-figma-copy text-[1.25rem] leading-[1.45] text-[var(--figma-ink-soft)] sm:text-[1.55rem]">
                {hotel.description}
              </p>

              <p className="mt-5 flex items-start gap-3 font-figma-copy text-[1.2rem] text-[var(--figma-ink)] sm:text-[1.45rem]">
                <span className="pt-1 text-[var(--figma-red)]">+</span>
                <span>{hotel.address}</span>
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-5 font-figma-copy text-[1.4rem] text-[var(--figma-ink)] sm:text-[1.7rem]">
                <div className="flex items-center justify-between gap-6">
                  <span>Price :</span>
                  <span>${hotel.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span>night :</span>
                  <span>{nights}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span>Total :</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/booking?hotelId=${encodeURIComponent(hotelId)}&venue=${encodeURIComponent(hotel.name)}&checkIn=${fromDate}&checkOut=${toDate}`}
                  className="figma-button figma-button-prominent flex h-[4.5rem] w-full font-figma-nav text-[2rem]"
                >
                  BOOK
                </Link>

                <Link
                  href={buildDateRangeHref("/venue", {
                    checkIn: fromDate,
                    checkOut: toDate,
                  })}
                  className="figma-text-action inline-flex items-center gap-2 font-figma-copy text-[1.35rem] text-[var(--figma-red)]"
                >
                  <span>
                    <Arrow direction="left" />
                  </span>
                  <span>Go Back</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
