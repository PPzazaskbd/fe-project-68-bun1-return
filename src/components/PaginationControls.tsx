"use client";

import Arrow from "./Arrow";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
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
