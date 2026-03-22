"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { BookingItem, HotelItem } from "@/interface";
import PaginationControls from "./PaginationControls";
import {
  calculateNights,
  formatBookingDate,
  loadBookings,
  saveBookings,
} from "@/libs/bookingStorage";

interface BookingListProps {
  hotels: HotelItem[];
  isAdmin?: boolean;
}

interface EditState {
  nameLastname: string;
  tel: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const ITEMS_PER_PAGE = 3;

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function BookingList({
  hotels,
  isAdmin = false,
}: BookingListProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const effectiveAdmin =
    isAdmin ||
    session?.user?.role === "admin" ||
    userEmail === "admin@example.com";

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editError, setEditError] = useState("");
  const [savedBookingId, setSavedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const allBookings = loadBookings();
    const filteredBookings = effectiveAdmin
      ? allBookings
      : allBookings.filter((item) => item.userEmail === userEmail);

    setBookings(filteredBookings);
  }, [effectiveAdmin, userEmail]);

  useEffect(() => {
    if (!savedBookingId) return;

    const timeout = window.setTimeout(() => {
      setSavedBookingId((current) => (current === savedBookingId ? null : current));
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [savedBookingId]);

  const hotelMap = useMemo(
    () => new Map(hotels.map((hotel) => [hotel.name, hotel])),
    [hotels],
  );

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const visibleBookings = bookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleRemove = (bookingId?: string) => {
    if (!bookingId) return;

    const updated = loadBookings().filter((item) => item.id !== bookingId);
    saveBookings(updated);

    setBookings((current) => current.filter((item) => item.id !== bookingId));
    setSavedBookingId((current) => (current === bookingId ? null : current));
  };

  const handleStartEdit = (item: BookingItem) => {
    setEditingId(item.id || null);
    setEditState({
      nameLastname: item.nameLastname,
      tel: item.tel,
      hotel: item.hotel,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: item.guests,
    });
    setEditError("");
    setSavedBookingId(null);
  };

  const handleSaveEdit = (item: BookingItem) => {
    if (!editState || !item.id) return;

    if (!editState.nameLastname.trim()) {
      setEditError("Guest name is required.");
      return;
    }

    if (!editState.tel.trim() || !/^\d+$/.test(editState.tel.trim())) {
      setEditError("Contact number must contain digits only.");
      return;
    }

    if (!editState.checkIn || !editState.checkOut || editState.checkOut <= editState.checkIn) {
      setEditError("Choose a valid stay period.");
      return;
    }

    const nights = calculateNights(editState.checkIn, editState.checkOut);
    if (nights > 3) {
      setEditError("Maximum stay is 3 nights.");
      return;
    }

    const updatedItem: BookingItem = {
      ...item,
      ...editState,
      nameLastname: editState.nameLastname.trim(),
      tel: editState.tel.trim(),
    };

    const allBookings = loadBookings().map((booking) =>
      booking.id === item.id ? updatedItem : booking,
    );
    saveBookings(allBookings);
    setBookings((current) =>
      current.map((booking) => (booking.id === item.id ? updatedItem : booking)),
    );
    setEditingId(null);
    setEditState(null);
    setEditError("");
    setSavedBookingId(item.id);
  };

  if (bookings.length === 0) {
    return (
      <div className="py-14 text-center font-figma-copy text-[1.6rem] text-[var(--figma-ink-soft)]">
        No bookings yet.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {visibleBookings.map((item) => {
          const hotel = hotelMap.get(item.hotel);
          const nights = Math.max(1, calculateNights(item.checkIn, item.checkOut));
          const total = (hotel?.price ?? 0) * nights;
          const isEditing = editingId === item.id;
          const isRecentlySaved = savedBookingId === item.id;

          return (
            <article
              key={item.id}
              className="border border-[rgba(171,25,46,0.08)] bg-[#fff8f3] p-4 transition-colors sm:p-5"
              style={
                isRecentlySaved
                  ? {
                      borderColor: "rgba(66, 113, 68, 0.25)",
                      background: "rgba(245, 250, 245, 0.96)",
                    }
                  : undefined
              }
            >
              {isRecentlySaved ? (
                <div className="figma-feedback figma-feedback-success mb-4">
                  <p className="font-figma-nav text-[1.1rem] tracking-[0.08em]">
                    BOOKING UPDATED
                  </p>
                  <p className="mt-1 font-figma-copy text-[1.05rem]">
                    Your changes were saved successfully.
                  </p>
                </div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-[160px_1fr_auto_auto] lg:items-start">
                <div className="relative aspect-square overflow-hidden bg-[#edf0f2]">
                  {hotel?.imgSrc ? (
                    <Image
                      src={hotel.imgSrc}
                      alt={hotel.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="space-y-2 font-figma-copy text-[1.25rem] text-[var(--figma-ink)]">
                  <p className="text-[1.65rem] text-[var(--figma-ink)]">{item.hotel}</p>
                  {effectiveAdmin ? (
                    <p className="text-[1.25rem] text-[var(--figma-ink-soft)]">
                      {item.nameLastname}
                    </p>
                  ) : null}
                  <p>{item.tel}</p>
                  <p>{hotel?.address ?? "Address unavailable"}</p>
                  <p>
                    {formatBookingDate(item.checkIn)} to {formatBookingDate(item.checkOut)}
                  </p>
                  {effectiveAdmin && item.userEmail ? (
                    <p className="text-[1.1rem] text-[var(--figma-red)]">{item.userEmail}</p>
                  ) : null}
                </div>

                <div className="min-w-[9rem] border-l border-[rgba(171,25,46,0.12)] pl-5 font-figma-copy text-[1.25rem] text-[var(--figma-ink)]">
                  <p className="flex items-center justify-between gap-4">
                    <span>$</span>
                    <span>{total.toLocaleString()}</span>
                  </p>
                  <p className="mt-3 flex items-center justify-between gap-4">
                    <span>#</span>
                    <span>{item.guests}</span>
                  </p>
                </div>

                <div className="flex gap-3 lg:flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      isEditing
                        ? (() => {
                            setEditingId(null);
                            setEditState(null);
                            setEditError("");
                          })()
                        : handleStartEdit(item)
                    }
                    className="figma-button h-[3.1rem] w-[3.1rem] p-0 text-[1.25rem]"
                    aria-label={isEditing ? "Cancel editing booking" : "Edit booking"}
                  >
                    {isEditing ? (
                      "x"
                    ) : (
                      <Image
                        src="/edit.svg"
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="figma-button h-[3.1rem] w-[3.1rem] p-0 text-[1.25rem]"
                    aria-label="Delete booking"
                  >
                    <Image
                      src="/delete.svg"
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              {isEditing && editState ? (
                <div className="mt-6 border-t border-[rgba(171,25,46,0.12)] pt-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <input
                      type="text"
                      value={editState.nameLastname}
                      onChange={(event) =>
                        setEditState({
                          ...editState,
                          nameLastname: event.target.value.replace(/\d/g, ""),
                        })
                      }
                      className="figma-input"
                      placeholder="Guest Name"
                    />

                    <input
                      type="tel"
                      value={editState.tel}
                      onChange={(event) =>
                        setEditState({
                          ...editState,
                          tel: event.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="figma-input"
                      placeholder="Phone Number"
                    />

                    <select
                      value={editState.hotel}
                      onChange={(event) =>
                        setEditState({ ...editState, hotel: event.target.value })
                      }
                      className="figma-input"
                    >
                      {hotels.map((hotelItem) => (
                        <option key={hotelItem._id} value={hotelItem.name}>
                          {hotelItem.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setEditState({
                            ...editState,
                            guests: Math.max(1, editState.guests - 1),
                          })
                        }
                        className="figma-button-secondary flex h-10 w-10 items-center justify-center text-[1.5rem]"
                      >
                        -
                      </button>
                      <span className="font-figma-copy text-[1.3rem] text-[var(--figma-ink)]">
                        {editState.guests} guest{editState.guests > 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditState({
                            ...editState,
                            guests: Math.min(10, editState.guests + 1),
                          })
                        }
                        className="figma-button-secondary flex h-10 w-10 items-center justify-center text-[1.5rem]"
                      >
                        +
                      </button>
                    </div>

                    <input
                      type="date"
                      value={editState.checkIn}
                      onChange={(event) => {
                        const nextCheckIn = event.target.value;
                        setEditState({
                          ...editState,
                          checkIn: nextCheckIn,
                          checkOut:
                            nextCheckIn >= editState.checkOut
                              ? addDays(nextCheckIn, 1)
                              : editState.checkOut,
                        });
                      }}
                      className="figma-input"
                    />

                    <input
                      type="date"
                      value={editState.checkOut}
                      min={addDays(editState.checkIn, 1)}
                      onChange={(event) =>
                        setEditState({ ...editState, checkOut: event.target.value })
                      }
                      className="figma-input"
                    />
                  </div>

                  {editError ? (
                    <p className="figma-feedback figma-feedback-error mt-4 font-figma-copy text-[1.2rem]">
                      {editError}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleSaveEdit(item)}
                    className="figma-button figma-button-prominent mt-5 px-6 py-3 font-figma-nav text-[1.4rem]"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
      />
    </div>
  );
}
