import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import getHotels from "@/libs/getHotels";

export default async function BookingPage() {
  const hotels = await getHotels();

  return (
    <main className="figma-page py-10 sm:py-12">
      <div className="figma-shell">
        <Suspense
          fallback={
            <div className="py-12 text-center font-figma-copy text-[1.5rem] text-[var(--figma-ink-soft)]">
              Loading booking form...
            </div>
          }
        >
          <BookingForm hotels={hotels.data} />
        </Suspense>
      </div>
    </main>
  );
}
