import { UserProfile } from "@/interface";

const PROFILE_API_BASE = "/api/profile";

interface UpdateProfilePayload {
  name: string;
  defaultGuestsAdult: number;
  defaultGuestsChild: number;
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

function extractProfile(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: UserProfile }).data
  ) {
    return (payload as { data: UserProfile }).data;
  }

  return payload as UserProfile;
}

export async function getProfile(token: string) {
  const response = await fetch(PROFILE_API_BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to load profile."));
  }

  return extractProfile(payload);
}

export async function updateUserProfile(
  token: string,
  profile: UpdateProfilePayload,
) {
  const response = await fetch(PROFILE_API_BASE, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Failed to update profile."));
  }

  return extractProfile(payload);
}
