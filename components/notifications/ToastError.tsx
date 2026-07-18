"use client";

import { AlertCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function ToastError({
  title,
  message,
  timestamp,
  onClose,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  message: string;
  timestamp?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-danger/30 bg-[var(--glass)] shadow-2xl shadow-black/40 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
          <AlertCircle className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-text">{title}</p>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1 text-subtext transition hover:bg-white/10 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-subtext">{message}</p>
          {timestamp && (
            <p className="mt-2 text-[11px] text-subtext">{timestamp}</p>
          )}
          {actionLabel && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  onAction?.();
                  onClose?.();
                }}
                className="rounded-lg bg-danger/20 px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-danger/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
