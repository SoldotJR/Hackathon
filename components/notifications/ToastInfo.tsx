"use client";

import { AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function ToastInfo({
  kind = "info",
  title,
  message,
  timestamp,
  onClose,
  actionLabel,
  onAction,
  className,
}: {
  kind?: "info" | "warning";
  title: string;
  message: string;
  timestamp?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  const isWarning = kind === "warning";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl bg-[var(--glass)] shadow-2xl shadow-black/40 backdrop-blur-xl",
        isWarning ? "border border-warning/30" : "border border-secondary/30",
        className
      )}
    >
      <div className="flex gap-3 p-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            isWarning
              ? "bg-warning/15 text-warning"
              : "bg-secondary/15 text-secondary"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
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
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2",
                  isWarning
                    ? "bg-warning/20 text-warning hover:bg-warning/30 focus-visible:ring-warning/50"
                    : "bg-secondary/20 text-secondary hover:bg-secondary/30 focus-visible:ring-secondary/50"
                )}
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
