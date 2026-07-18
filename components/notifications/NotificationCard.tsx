"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { AppNotification } from "@/types/notifications";
import { cn } from "@/utils/cn";
import { formatDistanceToNow } from "date-fns";

const ICONS = {
  success: { Icon: CheckCircle2, color: "text-accent" },
  info: { Icon: Info, color: "text-secondary" },
  warning: { Icon: AlertTriangle, color: "text-warning" },
  error: { Icon: AlertCircle, color: "text-danger" },
  ai: { Icon: Bot, color: "text-primary" },
} as const;

export function NotificationCard({
  notification,
  onDismiss,
  onMarkRead,
}: {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const router = useRouter();
  const meta = ICONS[notification.type] ?? ICONS.info;
  const Icon = meta.Icon;

  let timeLabel = "";
  try {
    timeLabel = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
    });
  } catch {
    timeLabel = "";
  }

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        onMarkRead(notification.id);
        if (notification.href) router.push(notification.href);
      }}
      className={cn(
        "flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5",
        !notification.read && "bg-primary/5"
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.color)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{notification.title}</p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-subtext">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[11px] text-subtext">{timeLabel}</span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                onDismiss(notification.id);
              }
            }}
            className="text-[11px] text-subtext hover:text-text"
          >
            Dismiss
          </span>
        </div>
      </div>
    </motion.button>
  );
}
