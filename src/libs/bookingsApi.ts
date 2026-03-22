import { BackendBookingItem, BookingJson, SingleBookingJson } from "@/interface";

const BOOKINGS_API_BASE = "/api/bookings";

interface BookingPayload {
  startDate: string;
  nights: number;
  roomNumber: string;
  guestsAdult: number;
  guestsChild: number;
}

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  const candidate = payload as {
    message?: string;
    msg?: string;
    error?: string;
  };

  return candidate.message || candidate.msg || candidate.error || fallbackMessage;
}

async function parseJson(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function extractBookingList(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload as BackendBookingItem[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as BookingJson).data)
  ) {
    return (payload as BookingJson).data;
  }

  return [];
}

function extractSingleBooking(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as SingleBookingJson).data
  ) {
    return (payload as SingleBookingJson).data;
  }

  return payload as BackendBookingItem;
}

export async function getBookings(token: string) {
  const response = await fetch(BOOKINGS_API_BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to load bookings."));
  }

  return extractBookingList(payload);
}

export async function createBooking(
  hotelId: string,
  token: string,
  booking: BookingPayload,
) {
  const response = await fetch(BOOKINGS_API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      hotelId,
      ...booking,
    }),
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to create booking."));
  }

  return extractSingleBooking(payload);
}

export async function updateBooking(
  bookingId: string,
  token: string,
  booking: BookingPayload,
) {
  const response = await fetch(`${BOOKINGS_API_BASE}/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(booking),
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to update booking."));
  }

  return extractSingleBooking(payload);
}

export async function deleteBooking(bookingId: string, token: string) {
  const response = await fetch(`${BOOKINGS_API_BASE}/${bookingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to delete booking."));
  }
}
