import { getTodayIsoDate } from "./bookingStorage";

export interface DateRangeValue {
  checkIn: string;
  checkOut: string;
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

export function normalizeDateRange(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
  fallbackCheckIn = getTodayIsoDate(),
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
  );
}

export function createDateRangeSearchParams(
  searchParams: SearchParamsLike,
  range: DateRangeValue,
) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set("checkIn", range.checkIn);
  nextParams.set("checkOut", range.checkOut);
  return nextParams;
}

export function buildDateRangeHref(pathname: string, range: DateRangeValue) {
  const nextParams = new URLSearchParams();
  nextParams.set("checkIn", range.checkIn);
  nextParams.set("checkOut", range.checkOut);
  return `${pathname}?${nextParams.toString()}`;
}
