import BookingListSkeleton from "@/components/BookingListSkeleton";

export default function AdminBookingsLoading() {
  return (
    <main className="figma-page py-10 sm:py-12">
      <div className="figma-shell">
        <div className="mx-auto mb-10 h-12 w-72 animate-pulse bg-[rgba(23,17,12,0.08)]" />
        <BookingListSkeleton />
      </div>
    </main>
  );
}
