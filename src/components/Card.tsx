import Image from "next/image";
import Link from "next/link";

interface CardProps {
  vid: string;
  name: string;
  address: string;
  province: string;
  price: number;
  imgSrc?: string;
}

export default function Card({
  vid,
  name,
  address,
  province,
  price,
  imgSrc,
}: CardProps) {
  return (
    <article className="figma-card-surface border border-[rgba(171,25,46,0.08)] bg-[#fff8f3]">
      <Link href={`/venue/${vid}`} className="block">
        <div className="relative aspect-[616/275] bg-[#d9d9d9]">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 616px"
              className="figma-card-image object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-figma-copy text-[1.8rem] text-[var(--figma-ink-soft)]">
              Some photo
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-end justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="truncate font-figma-copy text-[1.9rem] text-[var(--figma-ink)] sm:text-[2rem]">
            {name}
          </h2>
          <p className="font-figma-copy text-[1rem] text-[var(--figma-ink-soft)] sm:text-[1.15rem]">
            {province} - {address}
          </p>
          <p className="mt-1 font-figma-copy text-[1rem] text-[var(--figma-red)] sm:text-[1.1rem]">
            ${price.toLocaleString()} per night
          </p>
        </div>

        <Link
          href={`/venue/${vid}`}
          className="figma-button figma-card-detail-button px-4 py-1 font-figma-copy text-[1.15rem] normal-case sm:px-5 sm:text-[1.25rem]"
        >
          detail
        </Link>
      </div>
    </article>
  );
}
