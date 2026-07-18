"use client";

import type { ComponentProps } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";

type ToastKind = "success" | "error" | "info" | "warning";

const META: Record<
  ToastKind,
  { Icon: typeof CheckCircle2; color: string; border: string }
> = {
  success: {
    Icon: CheckCircle2,
    color: "text-accent",
    border: "border-accent/20",
  },
  error: {
    Icon: AlertCircle,
    color: "text-danger",
    border: "border-danger/20",
  },
  info: {
    Icon: Info,
    color: "text-secondary",
    border: "border-secondary/20",
  },
  warning: {
    Icon: AlertTriangle,
    color: "text-warning",
    border: "border-warning/20",
  },
};

export function SimpleToast({
  kind = "success",
  title,
  message,
  onClose,
  actionLabel,
  onAction,
}: {
  kind?: ToastKind;
  title: string;
  message?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { Icon, color, border } = META[kind];

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-[min(100vw-2rem,360px)] items-start gap-3 rounded-xl border bg-[var(--glass)] px-3.5 py-3 shadow-lg backdrop-blur-xl",
        border
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text">{title}</p>
        {message && (
          <p className="mt-0.5 line-clamp-2 text-xs text-subtext">{message}</p>
        )}
        {actionLabel && (
          <button
            type="button"
            onClick={() => {
              onAction?.();
              onClose?.();
            }}
            className={cn("mt-2 text-xs font-medium hover:underline", color)}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-md p-0.5 text-subtext hover:text-text"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastSuccess(
  props: Omit<ComponentProps<typeof SimpleToast>, "kind"> & {
    timestamp?: string;
    candidateName?: string;
    secondaryLabel?: string;
    onSecondary?: () => void;
  }
) {
  return (
    <SimpleToast
      kind="success"
      title={props.title}
      message={props.message}
      onClose={props.onClose}
      actionLabel={props.actionLabel ?? props.secondaryLabel}
      onAction={props.onAction ?? props.onSecondary}
    />
  );
}

export function ToastError(
  props: Omit<ComponentProps<typeof SimpleToast>, "kind"> & {
    timestamp?: string;
  }
) {
  return (
    <SimpleToast
      kind="error"
      title={props.title}
      message={props.message}
      onClose={props.onClose}
      actionLabel={props.actionLabel}
      onAction={props.onAction}
    />
  );
}

export function ToastInfo(
  props: Omit<ComponentProps<typeof SimpleToast>, "kind"> & {
    kind?: "info" | "warning";
    timestamp?: string;
  }
) {
  return (
    <SimpleToast
      kind={props.kind ?? "info"}
      title={props.title}
      message={props.message}
      onClose={props.onClose}
      actionLabel={props.actionLabel}
      onAction={props.onAction}
    />
  );
}
