interface BookingListSkeletonProps {
  count?: number;
}

export default function BookingListSkeleton({
  count = 3,
}: BookingListSkeletonProps) {
  return (
    <div>
      <div className="space-y-6">
        {Array.from({ length: count }, (_, index) => (
          <article
            key={index}
            className="border border-[rgba(171,25,46,0.08)] bg-[#fff8f3] p-4 sm:p-5"
          >
            <div className="grid gap-5 lg:grid-cols-[160px_1fr_auto_auto] lg:items-start">
              <div className="aspect-square overflow-hidden bg-[#edf0f2]">
                <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,rgba(235,219,212,0.85),rgba(247,239,235,0.95),rgba(235,219,212,0.85))] bg-[length:200%_100%]" />
              </div>

              <div className="space-y-3">
                <div className="h-8 w-2/3 animate-pulse bg-[rgba(23,17,12,0.08)]" />
                <div className="h-5 w-32 animate-pulse bg-[rgba(171,25,46,0.1)]" />
                <div className="h-5 w-40 animate-pulse bg-[rgba(23,17,12,0.08)]" />
                <div className="h-5 w-5/6 animate-pulse bg-[rgba(23,17,12,0.08)]" />
                <div className="h-5 w-1/2 animate-pulse bg-[rgba(171,25,46,0.1)]" />
              </div>

              <div className="min-w-[9rem] border-l border-[rgba(171,25,46,0.12)] pl-5">
                <div className="space-y-4">
                  <div className="h-6 w-full animate-pulse bg-[rgba(171,25,46,0.12)]" />
                  <div className="h-6 w-5/6 animate-pulse bg-[rgba(23,17,12,0.08)]" />
                </div>
              </div>

              <div className="flex gap-3 lg:flex-col">
                <div className="h-[3.1rem] w-[3.1rem] animate-pulse bg-[rgba(171,25,46,0.14)]" />
                <div className="h-[3.1rem] w-[3.1rem] animate-pulse bg-[rgba(171,25,46,0.14)]" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <div className="h-10 w-10 animate-pulse bg-[rgba(171,25,46,0.12)]" />
        <div className="h-10 w-12 animate-pulse bg-[rgba(171,25,46,0.16)]" />
        <div className="h-10 w-14 animate-pulse bg-[rgba(23,17,12,0.08)]" />
        <div className="h-10 w-10 animate-pulse bg-[rgba(171,25,46,0.12)]" />
      </div>
    </div>
  );
}
