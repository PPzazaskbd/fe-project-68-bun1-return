"use client";

import { useMemo, useState } from "react";
import { HotelItem, HotelJson } from "@/interface";
import Card from "./Card";
import DateRangeToolbar from "./DateRangeToolbar";
import PaginationControls from "./PaginationControls";
import { getTodayIsoDate } from "@/libs/bookingStorage";

interface CardPanelProps {
  hotelsJson: HotelJson;
}

const ITEMS_PER_PAGE = 4;

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function CardPanel({ hotelsJson }: CardPanelProps) {
  const hotels = hotelsJson.data ?? [];
  const today = getTodayIsoDate();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(addDays(today, 1));
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(hotels.length / ITEMS_PER_PAGE));

  const visibleHotels = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return hotels.slice(start, start + ITEMS_PER_PAGE);
  }, [hotels, page]);

  if (hotels.length === 0) {
    return (
      <div className="py-16 text-center font-figma-copy text-[1.6rem] text-[var(--figma-ink-soft)]">
        No hotels available at the moment.
      </div>
    );
  }

  return (
    <section className="figma-page py-6 sm:py-8">
      <div className="figma-shell">
        <DateRangeToolbar
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(value) => {
            setFromDate(value);
            if (value && value >= toDate) {
              setToDate(addDays(value, 1));
            }
          }}
          onToDateChange={setToDate}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visibleHotels.map((hotel: HotelItem) => (
            <Card
              key={hotel.id || hotel._id}
              vid={hotel.id || hotel._id}
              name={hotel.name}
              address={hotel.address}
              province={hotel.province}
              price={hotel.price}
              imgSrc={hotel.imgSrc}
            />
          ))}
        </div>

        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>
    </section>
  );
}
