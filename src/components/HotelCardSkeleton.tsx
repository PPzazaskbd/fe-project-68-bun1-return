export default function HotelCardSkeleton() {
  return (
    <article className="overflow-hidden border border-[rgba(171,25,46,0.08)] bg-[#fff8f3]">
      <div className="h-[15.5rem] animate-pulse bg-[linear-gradient(90deg,rgba(235,219,212,0.85),rgba(247,239,235,0.95),rgba(235,219,212,0.85))] bg-[length:200%_100%] sm:h-[17.5rem]" />

      <div className="space-y-4 px-5 py-4 sm:px-6">
        <div className="h-7 w-2/3 animate-pulse bg-[rgba(171,25,46,0.12)]" />
        <div className="h-4 w-5/6 animate-pulse bg-[rgba(23,17,12,0.08)]" />
        <div className="h-4 w-2/5 animate-pulse bg-[rgba(171,25,46,0.1)]" />

        <div className="flex justify-end">
          <div className="h-8 w-24 animate-pulse bg-[rgba(171,25,46,0.14)]" />
        </div>
      </div>
    </article>
  );
}
