import { useCallback, useEffect, useRef, useState } from "react";

export interface DismissibleNotice {
  type: "success" | "error";
  message: string;
  title?: string;
  isVisible: boolean;
}

interface ShowNoticeOptions {
  type: DismissibleNotice["type"];
  message: string;
  title?: string;
  autoHideMs?: number;
}

export function useDismissibleNotice(
  defaultAutoHideMs = 4200,
  clearDelayMs = 280,
) {
  const [notice, setNotice] = useState<DismissibleNotice | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNoticeTimers = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const dismissNotice = useCallback(
    (immediate = false) => {
      clearNoticeTimers();

      if (immediate) {
        setNotice(null);
        return;
      }

      setNotice((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          isVisible: false,
        };
      });

      clearTimerRef.current = setTimeout(() => {
        setNotice(null);
        clearTimerRef.current = null;
      }, clearDelayMs);
    },
    [clearDelayMs, clearNoticeTimers],
  );

  const showNotice = useCallback(
    ({ type, message, title, autoHideMs = defaultAutoHideMs }: ShowNoticeOptions) => {
      clearNoticeTimers();
      setNotice({
        type,
        message,
        title,
        isVisible: true,
      });

      if (autoHideMs > 0) {
        hideTimerRef.current = setTimeout(() => {
          dismissNotice();
          hideTimerRef.current = null;
        }, autoHideMs);
      }
    },
    [clearNoticeTimers, defaultAutoHideMs, dismissNotice],
  );

  useEffect(() => {
    return () => {
      clearNoticeTimers();
    };
  }, [clearNoticeTimers]);

  return {
    notice,
    showNotice,
    dismissNotice,
  };
}
