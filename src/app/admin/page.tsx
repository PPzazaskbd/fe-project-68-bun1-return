import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BookingList from "@/components/BookingList";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotels from "@/libs/getHotels";

export default async function AdminPage() {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin" && session.user.email !== "admin@example.com") {
    redirect("/");
  }

  const hotels = await getHotels();

  return (
    <main className="figma-page py-10 sm:py-12">
      <div className="figma-shell">
        <h1 className="mb-10 text-center font-figma-copy text-[2.6rem] text-[var(--figma-ink)] sm:text-[3rem]">
          User&apos;s Bookings
        </h1>
        <BookingList hotels={hotels.data} isAdmin />
      </div>
    </main>
  );
}
