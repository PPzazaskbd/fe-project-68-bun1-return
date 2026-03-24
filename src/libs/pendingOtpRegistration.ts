import { getSafeCallbackUrl } from "@/libs/authRedirect";

const PENDING_OTP_STORAGE_KEY = "pending-otp-registration";

export interface PendingOtpRegistration {
  name: string;
  email: string;
  callbackUrl: string;
  otpExpiresAt: string | null;
  resendAvailableAt: string | null;
  createdAt: number;
}

interface PendingOtpRegistrationInput {
  name?: string;
  email: string;
  callbackUrl: string | null;
  otpExpiresAt?: string | null;
  resendAvailableAt?: string | null;
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function normalizeDateString(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function createPendingOtpRegistrationPayload({
  name,
  email,
  callbackUrl,
  otpExpiresAt,
  resendAvailableAt,
}: PendingOtpRegistrationInput): PendingOtpRegistration {
  return {
    name: name?.trim() ?? "",
    email: email.trim(),
    callbackUrl: getSafeCallbackUrl(callbackUrl),
    otpExpiresAt: normalizeDateString(otpExpiresAt),
    resendAvailableAt: normalizeDateString(resendAvailableAt),
    createdAt: Date.now(),
  };
}

export function savePendingOtpRegistration(input: PendingOtpRegistrationInput) {
  if (!canUseSessionStorage()) {
    return;
  }

  const payload = createPendingOtpRegistrationPayload(input);
  window.sessionStorage.setItem(PENDING_OTP_STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingOtpRegistration() {
  if (!canUseSessionStorage()) {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(PENDING_OTP_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<PendingOtpRegistration> | null;

    if (!parsedValue?.email) {
      clearPendingOtpRegistration();
      return null;
    }

    return {
      name: typeof parsedValue.name === "string" ? parsedValue.name : "",
      email: String(parsedValue.email),
      callbackUrl: getSafeCallbackUrl(
        typeof parsedValue.callbackUrl === "string" ? parsedValue.callbackUrl : "/",
      ),
      otpExpiresAt: normalizeDateString(parsedValue.otpExpiresAt),
      resendAvailableAt: normalizeDateString(parsedValue.resendAvailableAt),
      createdAt:
        typeof parsedValue.createdAt === "number" ? parsedValue.createdAt : Date.now(),
    } satisfies PendingOtpRegistration;
  } catch {
    clearPendingOtpRegistration();
    return null;
  }
}

export function updatePendingOtpRegistration(
  updates: Partial<Pick<PendingOtpRegistration, "otpExpiresAt" | "resendAvailableAt" | "name">>,
) {
  const currentValue = getPendingOtpRegistration();

  if (!currentValue) {
    return null;
  }

  const nextValue: PendingOtpRegistration = {
    ...currentValue,
    name: typeof updates.name === "string" ? updates.name.trim() : currentValue.name,
    otpExpiresAt:
      updates.otpExpiresAt === undefined
        ? currentValue.otpExpiresAt
        : normalizeDateString(updates.otpExpiresAt),
    resendAvailableAt:
      updates.resendAvailableAt === undefined
        ? currentValue.resendAvailableAt
        : normalizeDateString(updates.resendAvailableAt),
  };

  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(PENDING_OTP_STORAGE_KEY, JSON.stringify(nextValue));
  }

  return nextValue;
}

export function clearPendingOtpRegistration() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(PENDING_OTP_STORAGE_KEY);
}
