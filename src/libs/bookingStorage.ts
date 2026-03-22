import { BookingItem } from "@/interface";

export const BOOKING_STORAGE_KEY = "bun1_bookings";

export function loadBookings(): BookingItem[] {
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookingItem[]) : [];
  } catch {
    return [];
  }
}

export function saveBookings(items: BookingItem[]) {
  try {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
}

export function calculateNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

export function formatBookingDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
