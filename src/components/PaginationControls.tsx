"use client";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

function Arrow({
  direction,
  disabled,
}: {
  direction: "left" | "right";
  disabled?: boolean;
}) {
  const rotation = direction === "left" ? "rotate(180deg)" : "none";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      style={{
        transform: rotation,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <path
        d="M6 12h10m-4-4 4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-5 text-sm">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="figma-pagination-button"
        aria-label="Previous page"
      >
        <Arrow direction="left" disabled={currentPage === 1} />
      </button>

      <div className="flex items-center gap-3 font-figma-copy text-[1rem] text-[var(--figma-ink)]">
        <span>page</span>
        <span className="figma-pagination-current">{currentPage}</span>
        <span>of</span>
        <span className="figma-pagination-total">{totalPages}</span>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="figma-pagination-button"
        aria-label="Next page"
      >
        <Arrow direction="right" disabled={currentPage === totalPages} />
      </button>
    </div>
  );
}
