import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getTodayIsoDate } from "@/libs/bookingStorage";
import { buildDateRangeHref, normalizeDateRange } from "@/libs/dateRangeParams";

interface BookingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getFirstParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions).catch(() => null);
  const hotelId = getFirstParamValue(resolvedSearchParams.hotelId);
  const redirectRange = normalizeDateRange(
    getFirstParamValue(resolvedSearchParams.checkIn),
    getFirstParamValue(resolvedSearchParams.checkOut),
    getTodayIsoDate(),
    getFirstParamValue(resolvedSearchParams.guestsAdult),
    getFirstParamValue(resolvedSearchParams.guestsChild),
    session?.user,
  );

  redirect(
    hotelId
      ? buildDateRangeHref(`/venue/${encodeURIComponent(hotelId)}`, redirectRange)
      : buildDateRangeHref("/venue", redirectRange),
  );
}
