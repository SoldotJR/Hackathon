"use client";

import { toast } from "sonner";
import { useNotificationStore } from "@/store/notification-store";
import type {
  AppNotification,
  NotificationCategory,
  NotificationKind,
} from "@/types/notifications";
import { ToastSuccess } from "@/components/notifications/ToastSuccess";
import { ToastError } from "@/components/notifications/ToastError";
import { ToastInfo } from "@/components/notifications/ToastInfo";

const DURATION = 4500;

type PushInput = {
  title: string;
  message: string;
  type: NotificationKind;
  category: NotificationCategory;
  href?: string;
  candidateName?: string;
  actions?: AppNotification["actions"];
};

function pushToCenter(input: PushInput) {
  return useNotificationStore.getState().add(input);
}

function showToast(
  kind: "success" | "error" | "info" | "warning",
  title: string,
  message: string,
  opts?: {
    actionLabel?: string;
    onAction?: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
    candidateName?: string;
    duration?: number;
  }
) {
  const duration = opts?.duration ?? DURATION;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (kind === "error") {
    return toast.custom(
      (id) => (
        <ToastError
          title={title}
          message={message}
          timestamp={timestamp}
          onClose={() => toast.dismiss(id)}
          actionLabel={opts?.actionLabel}
          onAction={opts?.onAction}
        />
      ),
      { duration }
    );
  }

  if (kind === "success") {
    return toast.custom(
      (id) => (
        <ToastSuccess
          title={title}
          message={message}
          timestamp={timestamp}
          candidateName={opts?.candidateName}
          onClose={() => toast.dismiss(id)}
          actionLabel={opts?.actionLabel}
          onAction={opts?.onAction}
          secondaryLabel={opts?.secondaryLabel}
          onSecondary={opts?.onSecondary}
        />
      ),
      { duration }
    );
  }

  return toast.custom(
    (id) => (
      <ToastInfo
        kind={kind === "warning" ? "warning" : "info"}
        title={title}
        message={message}
        timestamp={timestamp}
        onClose={() => toast.dismiss(id)}
        actionLabel={opts?.actionLabel}
        onAction={opts?.onAction}
      />
    ),
    { duration }
  );
}

/** Centralized notify API — toast + notification center */
export const notify = {
  success(
    title: string,
    message: string,
    opts?: {
      category?: NotificationCategory;
      href?: string;
      candidateName?: string;
      actionLabel?: string;
      onAction?: () => void;
      secondaryLabel?: string;
      onSecondary?: () => void;
      skipCenter?: boolean;
    }
  ) {
    if (!opts?.skipCenter) {
      pushToCenter({
        title,
        message,
        type: "success",
        category: opts?.category ?? "system",
        href: opts?.href,
        candidateName: opts?.candidateName,
        actions: [
          ...(opts?.href
            ? [{ id: "view", label: "View", href: opts.href }]
            : []),
          { id: "dismiss", label: "Dismiss" },
        ],
      });
    }
    return showToast("success", title, message, opts);
  },

  info(
    title: string,
    message: string,
    opts?: {
      category?: NotificationCategory;
      href?: string;
      actionLabel?: string;
      onAction?: () => void;
      skipCenter?: boolean;
    }
  ) {
    if (!opts?.skipCenter) {
      pushToCenter({
        title,
        message,
        type: "info",
        category: opts?.category ?? "system",
        href: opts?.href,
        actions: [
          ...(opts?.href
            ? [{ id: "view", label: "View", href: opts.href }]
            : []),
          { id: "dismiss", label: "Dismiss" },
        ],
      });
    }
    return showToast("info", title, message, opts);
  },

  warning(
    title: string,
    message: string,
    opts?: {
      category?: NotificationCategory;
      href?: string;
      actionLabel?: string;
      onAction?: () => void;
      skipCenter?: boolean;
    }
  ) {
    if (!opts?.skipCenter) {
      pushToCenter({
        title,
        message,
        type: "warning",
        category: opts?.category ?? "system",
        href: opts?.href,
        actions: [
          ...(opts?.href
            ? [{ id: "view", label: "View", href: opts.href }]
            : []),
          { id: "dismiss", label: "Dismiss" },
        ],
      });
    }
    return showToast("warning", title, message, opts);
  },

  error(
    title: string,
    message: string,
    opts?: {
      category?: NotificationCategory;
      href?: string;
      actionLabel?: string;
      onAction?: () => void;
      skipCenter?: boolean;
    }
  ) {
    if (!opts?.skipCenter) {
      pushToCenter({
        title,
        message,
        type: "error",
        category: opts?.category ?? "system",
        href: opts?.href,
        actions: [
          ...(opts?.actionLabel
            ? [{ id: "retry", label: opts.actionLabel }]
            : []),
          { id: "dismiss", label: "Dismiss" },
        ],
      });
    }
    return showToast("error", title, message, {
      ...opts,
      actionLabel: opts?.actionLabel ?? "Retry",
      onAction: opts?.onAction,
    });
  },

  ai(
    title: string,
    message: string,
    opts?: {
      category?: NotificationCategory;
      href?: string;
      skipCenter?: boolean;
    }
  ) {
    if (!opts?.skipCenter) {
      pushToCenter({
        title,
        message,
        type: "ai",
        category: opts?.category ?? "automation",
        href: opts?.href,
        actions: [
          ...(opts?.href
            ? [{ id: "view", label: "View Results", href: opts.href }]
            : []),
          { id: "dismiss", label: "Dismiss" },
        ],
      });
    }
    return showToast("info", title, message, {
      actionLabel: "View",
      onAction: opts?.href
        ? () => {
            window.location.href = opts.href!;
          }
        : undefined,
    });
  },

  /** Preset: Offer letter sent */
  offerSent(candidateName: string) {
    const title = "Offer Letter Sent Successfully";
    const message = `The offer letter and welcome email have been successfully sent to ${candidateName}.`;
    pushToCenter({
      title,
      message,
      type: "success",
      category: "emails",
      candidateName,
      href: "/dashboard/recruitment?tab=offer",
      actions: [
        { id: "view-email", label: "View Email", href: "/dashboard/recruitment?tab=offer" },
        { id: "view-candidate", label: "View Candidate", href: "/dashboard/candidates" },
        { id: "dismiss", label: "Dismiss" },
      ],
    });
    return showToast("success", title, message, {
      candidateName,
      actionLabel: "View Email",
      onAction: () => {
        window.location.href = "/dashboard/recruitment?tab=offer";
      },
      secondaryLabel: "Undo",
      onSecondary: () => {
        notify.info("Offer send undone", `Offer to ${candidateName} marked as draft.`, {
          category: "emails",
          skipCenter: false,
        });
      },
      duration: 6000,
    });
  },

  resumeUploaded(filename?: string) {
    return notify.success(
      "Resume uploaded successfully",
      filename
        ? `${filename} was parsed and added to the candidate pool.`
        : "Your resume was uploaded and parsed successfully.",
      {
        category: "recruitment",
        href: "/dashboard/recruitment",
      }
    );
  },

  interviewScheduled(candidateName: string) {
    return notify.success(
      "Interview invitation sent",
      `Interview invitation has been sent to ${candidateName}.`,
      {
        category: "recruitment",
        candidateName,
        href: "/dashboard/recruitment?tab=interview",
      }
    );
  },

  reminderScheduled(when = "tomorrow at 9:00 AM") {
    return notify.success(
      "Reminder scheduled",
      `Reminder scheduled for ${when}.`,
      {
        category: "automation",
        href: "/dashboard/automation?tab=reminders",
      }
    );
  },

  candidateRejected(candidateName: string) {
    return notify.success(
      "Rejection email sent",
      `Rejection email has been sent to ${candidateName}.`,
      {
        category: "emails",
        candidateName,
        href: "/dashboard/automation?tab=communication",
      }
    );
  },

  reportExported(format = "PDF") {
    return notify.success(
      "Report exported successfully",
      `Your ${format} report is ready.`,
      {
        category: "system",
        href: "/dashboard/reports",
      }
    );
  },

  emailFailed(onRetry?: () => void) {
    return notify.error("Unable to send email", "The email could not be delivered. Please try again.", {
      category: "emails",
      actionLabel: "Retry",
      onAction: onRetry,
    });
  },

  workflowCompleted() {
    pushToCenter({
      title: "Recruitment workflow completed",
      message: "AI agents finished screening, ranking, and recommendations.",
      type: "ai",
      category: "recruitment",
      href: "/dashboard/recruitment",
      actions: [
        { id: "view", label: "View Results", href: "/dashboard/recruitment" },
        { id: "dismiss", label: "Dismiss" },
      ],
    });
    return showToast(
      "success",
      "Recruitment workflow completed",
      "AI agents finished screening, ranking, and recommendations.",
      {
        actionLabel: "View Results",
        onAction: () => {
          window.location.href = "/dashboard/recruitment";
        },
      }
    );
  },
};
