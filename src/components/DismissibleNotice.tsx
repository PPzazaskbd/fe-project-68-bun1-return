import { DismissibleNotice as NoticeState } from "@/libs/useDismissibleNotice";

interface DismissibleNoticeProps {
  notice: NoticeState | null;
  onClose: (immediate?: boolean) => void;
  className?: string;
}

export default function DismissibleNotice({
  notice,
  onClose,
  className = "",
}: DismissibleNoticeProps) {
  const visibilityClass = notice
    ? notice.isVisible
      ? "mt-1 max-h-48 translate-y-0 opacity-100"
      : "mt-0 max-h-0 -translate-y-2 opacity-0"
    : "mt-0 max-h-0 opacity-0";

  return (
    <div
      aria-live="polite"
      className={`overflow-hidden transition-all duration-300 ease-out ${visibilityClass} ${className}`.trim()}
    >
      {notice ? (
        <div
          className={`figma-feedback flex items-start gap-3 font-figma-copy text-[1.2rem] ${
            notice.type === "success"
              ? "figma-feedback-success"
              : "figma-feedback-error"
          }`}
        >
          <div className="flex-1 text-center">
            {notice.title ? (
              <p className="font-figma-nav text-[1.1rem] tracking-[0.08em]">
                {notice.title}
              </p>
            ) : null}
            <p className={notice.title ? "mt-1" : ""}>{notice.message}</p>
          </div>

          <button
            type="button"
            onClick={() => onClose()}
            className="shrink-0 text-[1rem] tracking-[0.08em] opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            CLOSE
          </button>
        </div>
      ) : null}
    </div>
  );
}
