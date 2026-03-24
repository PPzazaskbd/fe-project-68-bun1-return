import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl } from "@/libs/backendApiBase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(buildBackendUrl("/auth/register/initiate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Registration service unavailable." }, { status: 502 });
  }
}
