"use client";

import DismissibleNotice from "@/components/DismissibleNotice";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BackendBookingItem, BookingItem, HotelItem } from "@/interface";
import BookingListSkeleton from "./BookingListSkeleton";
import PaginationControls from "./PaginationControls";
import {
  calculateNights,
  formatBookingDate,
} from "@/libs/bookingStorage";
import {
  deleteBooking,
  getBookings,
  updateBooking,
} from "@/libs/bookingsApi";
import { useDismissibleNotice } from "@/libs/useDismissibleNotice";

interface BookingListProps {
  hotels: HotelItem[];
  isAdmin?: boolean;
}

interface EditState {
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guestsAdult: number;
  guestsChild: number;
}

const ITEMS_PER_PAGE = 3;

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toIsoDate(value: string) {
  return value.slice(0, 10);
}

function getReferenceValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const candidate = value as {
      _id?: unknown;
      id?: unknown;
      name?: unknown;
      title?: unknown;
    };

    if (typeof candidate._id === "string" || typeof candidate._id === "number") {
      return String(candidate._id);
    }

    if (typeof candidate.id === "string" || typeof candidate.id === "number") {
      return String(candidate.id);
    }

    if (typeof candidate.name === "string" || typeof candidate.name === "number") {
      return String(candidate.name);
    }

    if (typeof candidate.title === "string" || typeof candidate.title === "number") {
      return String(candidate.title);
    }
  }

  return "";
}

function normalizeLookupValue(value: unknown) {
  return getReferenceValue(value).trim().toLowerCase();
}

function findHotelByReference(reference: unknown, hotels: HotelItem[]) {
  const normalizedReference = normalizeLookupValue(reference);

  if (!normalizedReference) {
    return undefined;
  }

  return hotels.find((hotel) => {
    const candidates = [hotel._id, hotel.id, hotel.name]
      .filter((value): value is string => Boolean(value))
      .map((value) => normalizeLookupValue(value));

    return candidates.includes(normalizedReference);
  });
}

function mapBackendBooking(item: BackendBookingItem, hotels: HotelItem[]): BookingItem {
  const hotelId = getReferenceValue(item.hotel);
  const matchedHotel = findHotelByReference(hotelId, hotels);
  const startDate = toIsoDate(item.startDate);
  const nights = Math.max(1, item.nights || 1);

  const hotelLabel =
    matchedHotel?.name ||
    (item.hotel && typeof item.hotel === "object" && "name" in item.hotel
      ? getReferenceValue((item.hotel as { name?: unknown }).name)
      : "") ||
    hotelId ||
    "Hotel unavailable";

  const userId = getReferenceValue(item.user);

  return {
    id: item._id,
    hotelId: hotelId || matchedHotel?._id || matchedHotel?.id || "",
    userId,
    hotel: hotelLabel,
    checkIn: startDate,
    checkOut: addDays(startDate, nights),
    roomNumber: item.roomNumber || "-",
    guestsAdult: typeof item.guestsAdult === "number" ? item.guestsAdult : 0,
    guestsChild: typeof item.guestsChild === "number" ? item.guestsChild : 0,
    nights,
    totalPrice: item.totalPrice,
    createdAt: item.createdAt ? toIsoDate(item.createdAt) : undefined,
  };
}

export default function BookingList({
  hotels,
  isAdmin = false,
}: BookingListProps) {
  const { data: session, status: sessionStatus, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookedNoticeHandledRef = useRef(false);
  const userEmail = session?.user?.email || "";
  const effectiveAdmin =
    isAdmin ||
    session?.user?.role === "admin" ||
    userEmail === "admin@example.com";
  const token = session?.user?.token || "";
  const { notice: listNotice, showNotice: showListNotice, dismissNotice: dismissListNotice } =
    useDismissibleNotice(2600);
  const { notice: editNotice, showNotice: showEditNotice, dismissNotice: dismissEditNotice } =
    useDismissibleNotice();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [listError, setListError] = useState("");
  const [savedBookingId, setSavedBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearBookedFlag = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("booked");
    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const handleDismissListNotice = (immediate = false) => {
    dismissListNotice(immediate);

    if (listError) {
      setListError("");
    }

    if (searchParams.get("booked") === "1") {
      clearBookedFlag();
    }
  };

  const handleDismissEditNotice = (immediate = false) => {
    dismissEditNotice(immediate);
  };

  useEffect(() => {
    if (!savedBookingId) return;

    const timeout = window.setTimeout(() => {
      setSavedBookingId((current) => (current === savedBookingId ? null : current));
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [savedBookingId]);

  useEffect(() => {
    const isBooked = searchParams.get("booked") === "1";

    if (!isBooked) {
      bookedNoticeHandledRef.current = false;
      return;
    }

    if (bookedNoticeHandledRef.current) {
      return;
    }

    bookedNoticeHandledRef.current = true;
    showListNotice({
      type: "success",
      title: "BOOKING CONFIRMED",
      message: "Your reservation was sent to the backend successfully.",
      autoHideMs: 2600,
    });

    const timeout = window.setTimeout(() => {
      clearBookedFlag();
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, showListNotice]);

  useEffect(() => {
    if (!listError) {
      return;
    }

    showListNotice({
      type: "error",
      message: listError,
    });
  }, [listError, showListNotice]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!token) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const loadBookingItems = async () => {
      setIsLoading(true);
      setListError("");

      try {
        const backendBookings = await getBookings(token);

        if (!ignore) {
          setBookings(backendBookings.map((item) => mapBackendBooking(item, hotels)));
        }
      } catch (loadError) {
        if (!ignore) {
          setBookings([]);
          setListError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load bookings.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadBookingItems();

    return () => {
      ignore = true;
    };
  }, [hotels, sessionStatus, token]);

  const hotelMap = useMemo(
    () =>
      new Map(
        hotels.flatMap((hotel) =>
          [hotel._id, hotel.id, hotel.name]
            .filter((value): value is string => Boolean(value))
            .map((value) => [normalizeLookupValue(value), hotel] as const),
        ),
      ),
    [hotels],
  );

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const visibleBookings = bookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleRemove = async (bookingId?: string) => {
    if (!bookingId || !token) return;

    setListError("");

    try {
      await deleteBooking(bookingId, token);
      setBookings((current) => current.filter((item) => item.id !== bookingId));
      setSavedBookingId((current) => (current === bookingId ? null : current));
    } catch (removeError) {
      setListError(
        removeError instanceof Error
          ? removeError.message
          : "Failed to delete booking.",
      );
    }
  };

  const handleStartEdit = (item: BookingItem) => {
    setEditingId(item.id || null);
    setEditState({
      roomNumber: item.roomNumber,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guestsAdult: item.guestsAdult,
      guestsChild: item.guestsChild,
    });
    dismissEditNotice(true);
    setSavedBookingId(null);
  };

  const handleSaveEdit = async (item: BookingItem) => {
    if (!editState || !item.id || !token) return;

    if (!editState.roomNumber.trim()) {
      showEditNotice({ type: "error", message: "Room number is required." });
      return;
    }

    if (editState.guestsAdult < 1) {
      showEditNotice({ type: "error", message: "At least one adult guest is required." });
      return;
    }

    if (editState.guestsChild < 0) {
      showEditNotice({ type: "error", message: "Child guest count cannot be negative." });
      return;
    }

    if (!editState.checkIn || !editState.checkOut || editState.checkOut <= editState.checkIn) {
      showEditNotice({ type: "error", message: "Choose a valid stay period." });
      return;
    }

    const nights = calculateNights(editState.checkIn, editState.checkOut);
    if (nights > 3) {
      showEditNotice({ type: "error", message: "Maximum stay is 3 nights." });
      return;
    }

    try {
      const updatedBooking = await updateBooking(item.id, token, {
        startDate: editState.checkIn,
        nights,
        roomNumber: editState.roomNumber.trim(),
        guestsAdult: editState.guestsAdult,
        guestsChild: editState.guestsChild,
      });
      const normalizedBooking = mapBackendBooking(updatedBooking, hotels);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === item.id
            ? {
                ...booking,
                ...normalizedBooking,
              }
            : booking,
        ),
      );
      setEditingId(null);
      setEditState(null);
      dismissEditNotice(true);
      setSavedBookingId(item.id);
      setListError("");
      await update({
        user: {
          ...session?.user,
          defaultGuestsAdult: editState.guestsAdult,
          defaultGuestsChild: editState.guestsChild,
        },
      }).catch(() => null);
    } catch (saveError) {
      showEditNotice({
        type: "error",
        message:
          saveError instanceof Error
            ? saveError.message
            : "Failed to update booking.",
      });
    }
  };

  if (isLoading) {
    return <BookingListSkeleton />;
  }

  if (bookings.length === 0) {
    return (
      <div className="space-y-4">
        <DismissibleNotice notice={listNotice} onClose={handleDismissListNotice} />

        <div className="py-14 text-center font-figma-copy text-[1.6rem] text-[var(--figma-ink-soft)]">
          No bookings yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      <DismissibleNotice notice={listNotice} onClose={handleDismissListNotice} className="mb-5" />

      <div className="space-y-6">
        {visibleBookings.map((item) => {
          const hotel =
            hotelMap.get(normalizeLookupValue(item.hotelId)) ||
            hotelMap.get(normalizeLookupValue(item.hotel));
          const nights = item.nights ?? Math.max(1, calculateNights(item.checkIn, item.checkOut));
          const total = item.totalPrice > 0 ? item.totalPrice : (hotel?.price ?? 0) * nights;
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
              <DismissibleNotice
                notice={
                  isRecentlySaved
                    ? {
                        type: "success",
                        title: "BOOKING UPDATED",
                        message: "Your changes were saved successfully.",
                        isVisible: true,
                      }
                    : null
                }
                onClose={() => setSavedBookingId(null)}
                className="mb-4"
              />

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
                  <p>Room {item.roomNumber}</p>
                  <p>
                    {item.guestsAdult} adult{item.guestsAdult === 1 ? "" : "s"}
                    {item.guestsChild > 0
                      ? `, ${item.guestsChild} child${item.guestsChild === 1 ? "" : "ren"}`
                      : ""}
                  </p>
                  <p>{hotel?.address ?? "Address unavailable"}</p>
                  <p>
                    {formatBookingDate(item.checkIn)} to {formatBookingDate(item.checkOut)}
                  </p>
                  {effectiveAdmin ? (
                    <p className="text-[1.1rem] text-[var(--figma-red)]">
                      User ID: {item.userId}
                    </p>
                  ) : null}
                  {item.createdAt ? (
                    <p className="text-[1.05rem] text-[var(--figma-ink-soft)]">
                      Created {formatBookingDate(item.createdAt)}
                    </p>
                  ) : null}
                </div>

                <div className="min-w-[9rem] border-l border-[rgba(171,25,46,0.12)] pl-5 font-figma-copy text-[1.25rem] text-[var(--figma-ink)]">
                  <p className="flex items-center justify-between gap-4">
                    <Image
                      src="/thaiBaht.svg"
                      alt="Thai Baht"
                      width={20}
                      height={20}
                    />
                    <span>{total.toLocaleString()}</span>
                  </p>
                  <p className="mt-3 flex items-center justify-between gap-4">
                    <Image
                      src="/roomNumber.svg"
                      alt="Room number"
                      width={20}
                      height={20}
                    />
                    <span>{item.roomNumber}</span>
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
                            dismissEditNotice(true);
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
                    onClick={() => void handleRemove(item.id)}
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
                      value={editState.roomNumber}
                      onChange={(event) =>
                        setEditState({
                          ...editState,
                          roomNumber: event.target.value,
                        })
                      }
                      className="figma-input"
                      placeholder="Room Number"
                    />

                    <div className="font-figma-copy text-[1.15rem] text-[var(--figma-ink-soft)]">
                      Hotel: {item.hotel}
                    </div>

                    <input
                      type="number"
                      min={1}
                      value={editState.guestsAdult}
                      onChange={(event) =>
                        setEditState({
                          ...editState,
                          guestsAdult: Math.max(1, Number(event.target.value) || 1),
                        })
                      }
                      className="figma-input"
                      placeholder="Adult Guests"
                    />

                    <input
                      type="number"
                      min={0}
                      value={editState.guestsChild}
                      onChange={(event) =>
                        setEditState({
                          ...editState,
                          guestsChild: Math.max(0, Number(event.target.value) || 0),
                        })
                      }
                      className="figma-input"
                      placeholder="Child Guests"
                    />

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

                  <DismissibleNotice
                    notice={editNotice}
                    onClose={handleDismissEditNotice}
                    className="mt-4"
                  />

                  <button
                    type="button"
                    onClick={() => void handleSaveEdit(item)}
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
