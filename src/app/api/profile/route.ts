import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_BASE } from "@/libs/backendApiBase";

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
    const response = await fetch(`${BACKEND_API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to load profile.");
  } catch {
    return NextResponse.json(
      { message: "Profile service unavailable." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authorization = getAuthorizationHeader(request);

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_API_BASE}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);

    return jsonResponse(payload, response.status, "Failed to update profile.");
  } catch {
    return NextResponse.json(
      { message: "Profile service unavailable." },
      { status: 502 },
    );
  }
}
