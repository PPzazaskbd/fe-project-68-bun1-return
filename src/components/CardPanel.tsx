"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredHotels = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) return hotels;

    return hotels.filter((hotel) =>
      [hotel.name, hotel.address, hotel.province, hotel.region]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedTerm)),
    );
  }, [hotels, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / ITEMS_PER_PAGE));

  const visibleHotels = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredHotels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHotels, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <label className="font-figma-nav text-[1rem] tracking-[0.08em] text-[var(--figma-red)]">
              FIND A HOTEL
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="figma-input mt-2"
              placeholder="Search by hotel name, city, or address"
            />
          </div>

          <p className="font-figma-copy text-[1.15rem] text-[var(--figma-ink-soft)] lg:text-right">
            {filteredHotels.length} hotel{filteredHotels.length === 1 ? "" : "s"} available
          </p>
        </div>

        {visibleHotels.length > 0 ? (
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
        ) : (
          <div className="mt-10 border border-[rgba(171,25,46,0.1)] bg-[rgba(255,245,244,0.55)] px-6 py-10 text-center">
            <p className="font-figma-nav text-[1.35rem] tracking-[0.08em] text-[var(--figma-red)]">
              NO HOTELS MATCH THIS FILTER
            </p>
            <p className="mt-2 font-figma-copy text-[1.3rem] text-[var(--figma-ink-soft)]">
              Try a different hotel name, city, or address keyword.
            </p>
          </div>
        )}

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
