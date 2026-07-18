"use client";

import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function ToastSuccess({
  title,
  message,
  timestamp,
  candidateName,
  onClose,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
}: {
  title: string;
  message: string;
  timestamp?: string;
  candidateName?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-accent/25 bg-[var(--glass)] shadow-2xl shadow-black/40 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
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
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-subtext">
            {candidateName && (
              <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-accent">
                {candidateName}
              </span>
            )}
            {timestamp && <span>{timestamp}</span>}
          </div>
          {(actionLabel || secondaryLabel) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    onAction?.();
                    onClose?.();
                  }}
                  className="rounded-lg bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  {actionLabel}
                </button>
              )}
              {secondaryLabel && (
                <button
                  type="button"
                  onClick={() => {
                    onSecondary?.();
                    onClose?.();
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-subtext transition hover:bg-white/10 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {secondaryLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
