import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl } from "@/libs/backendApiBase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(buildBackendUrl("/auth/verify-otp"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);

    return NextResponse.json(
      payload ?? { message: "Failed to verify OTP." },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      { message: "OTP verification service unavailable." },
      { status: 502 },
    );
  }
}
