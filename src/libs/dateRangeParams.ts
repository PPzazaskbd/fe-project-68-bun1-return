import { getTodayIsoDate } from "./bookingStorage";

export interface DateRangeValue {
  checkIn: string;
  checkOut: string;
  guestsAdult: number;
  guestsChild: number;
}

interface SearchParamsLike {
  get(name: string): string | null;
  toString(): string;
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysToIsoDate(base: string, days: number) {
  const date = parseIsoDate(base);
  date.setDate(date.getDate() + days);
  return formatIsoDate(date);
}

export function isValidIsoDate(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function normalizeGuestCount(
  value: string | number | null | undefined,
  fallbackValue: number,
  minimum: number,
) {
  const parsedValue =
    typeof value === "number"
      ? value
      : Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue >= minimum
    ? parsedValue
    : fallbackValue;
}

export function normalizeDateRange(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
  fallbackCheckIn = getTodayIsoDate(),
  guestsAdult?: string | number | null,
  guestsChild?: string | number | null,
): DateRangeValue {
  const normalizedCheckIn = isValidIsoDate(checkIn) ? checkIn : fallbackCheckIn;
  const minimumCheckOut = addDaysToIsoDate(normalizedCheckIn, 1);
  const normalizedCheckOut =
    isValidIsoDate(checkOut) && checkOut > normalizedCheckIn
      ? checkOut
      : minimumCheckOut;

  return {
    checkIn: normalizedCheckIn,
    checkOut: normalizedCheckOut,
    guestsAdult: normalizeGuestCount(guestsAdult, 1, 1),
    guestsChild: normalizeGuestCount(guestsChild, 0, 0),
  };
}

export function getDateRangeFromSearchParams(
  searchParams: SearchParamsLike,
  fallbackCheckIn = getTodayIsoDate(),
) {
  return normalizeDateRange(
    searchParams.get("checkIn"),
    searchParams.get("checkOut"),
    fallbackCheckIn,
    searchParams.get("guestsAdult"),
    searchParams.get("guestsChild"),
  );
}

export function createDateRangeSearchParams(
  searchParams: SearchParamsLike,
  range: DateRangeValue,
) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set("checkIn", range.checkIn);
  nextParams.set("checkOut", range.checkOut);
  nextParams.set("guestsAdult", String(range.guestsAdult));
  nextParams.set("guestsChild", String(range.guestsChild));
  return nextParams;
}

export function buildDateRangeHref(pathname: string, range: DateRangeValue) {
  const nextParams = new URLSearchParams();
  nextParams.set("checkIn", range.checkIn);
  nextParams.set("checkOut", range.checkOut);
  nextParams.set("guestsAdult", String(range.guestsAdult));
  nextParams.set("guestsChild", String(range.guestsChild));
  return `${pathname}?${nextParams.toString()}`;
}
