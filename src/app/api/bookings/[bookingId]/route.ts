import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_BASE } from "@/libs/backendApiBase";

function getAuthorizationHeader(request: NextRequest) {
  return request.headers.get("authorization");
}

function getBookingId(
  context: { params: Promise<{ bookingId: string }> },
) {
  return context.params.then((params) => params.bookingId);
}

function jsonResponse(payload: unknown, status: number, fallbackMessage: string) {
  if (payload === null || payload === undefined) {
    return NextResponse.json({ message: fallbackMessage }, { status });
  }

  return NextResponse.json(payload, { status });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> },
) {
  const authorization = getAuthorizationHeader(request);

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const bookingId = await getBookingId(context);
    const body = await request.json();
    const response = await fetch(
      `${BACKEND_API_BASE}/bookings/${encodeURIComponent(bookingId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      },
    );
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to update booking.");
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable." },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> },
) {
  const authorization = getAuthorizationHeader(request);

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const bookingId = await getBookingId(context);
    const response = await fetch(
      `${BACKEND_API_BASE}/bookings/${encodeURIComponent(bookingId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      },
    );
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to delete booking.");
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable." },
      { status: 502 },
    );
  }
}
