import { NextRequest, NextResponse } from "next/server";

const BACKEND_BOOKINGS_API_BASE = "https://backend-for-frontend-bun1.vercel.app/api/v1";

function getAuthorizationHeader(request: NextRequest) {
  return request.headers.get("authorization");
}

function jsonResponse(payload: unknown, status: number, fallbackMessage: string) {
  if (payload === null || payload === undefined) {
    return NextResponse.json({ message: fallbackMessage }, { status });
  }

  return NextResponse.json(payload, { status });
}

export async function GET(request: NextRequest) {
  const authorization = getAuthorizationHeader(request);

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_BOOKINGS_API_BASE}/bookings`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to load bookings.");
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authorization = getAuthorizationHeader(request);

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { hotelId, ...bookingPayload } = body;

    if (typeof hotelId !== "string" || !hotelId.trim()) {
      return NextResponse.json(
        { message: "hotelId is required." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${BACKEND_BOOKINGS_API_BASE}/hotels/${encodeURIComponent(hotelId)}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(bookingPayload),
      },
    );
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to create booking.");
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable." },
      { status: 502 },
    );
  }
}
