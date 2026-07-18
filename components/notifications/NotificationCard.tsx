"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Info,
  Mail,
  Sparkles,
} from "lucide-react";
import type { AppNotification } from "@/types/notifications";
import { cn } from "@/utils/cn";
import { formatDistanceToNow } from "date-fns";

const TYPE_META = {
  success: {
    Icon: CheckCircle2,
    border: "border-l-accent",
    iconBg: "bg-accent/15 text-accent",
  },
  info: {
    Icon: Info,
    border: "border-l-secondary",
    iconBg: "bg-secondary/15 text-secondary",
  },
  warning: {
    Icon: AlertTriangle,
    border: "border-l-warning",
    iconBg: "bg-warning/15 text-warning",
  },
  error: {
    Icon: AlertCircle,
    border: "border-l-danger",
    iconBg: "bg-danger/15 text-danger",
  },
  ai: {
    Icon: Bot,
    border: "border-l-primary",
    iconBg: "bg-primary/15 text-primary",
  },
} as const;

function categoryIcon(category: AppNotification["category"]) {
  if (category === "emails") return Mail;
  if (category === "recruitment") return Sparkles;
  return null;
}

export function NotificationCard({
  notification,
  onDismiss,
  onMarkRead,
  onAction,
}: {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
  onAction?: (id: string, actionId: string) => void;
}) {
  const router = useRouter();
  const meta = TYPE_META[notification.type] ?? TYPE_META.info;
  const Icon = meta.Icon;
  const CatIcon = categoryIcon(notification.category);

  const timeLabel = (() => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      });
    } catch {
      return notification.createdAt;
    }
  })();

  const go = (href?: string) => {
    onMarkRead(notification.id);
    if (href) router.push(href);
  };

  const actions =
    notification.actions && notification.actions.length > 0
      ? notification.actions
      : [
          ...(notification.href
            ? [{ id: "view", label: "View", href: notification.href }]
            : [{ id: "read", label: "Mark as Read" }]),
          { id: "dismiss", label: "Dismiss" },
        ];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -1 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/8 bg-surface/40 pl-0 shadow-sm transition",
        "hover:border-white/15 hover:bg-surface/70 hover:shadow-lg hover:shadow-black/20",
        "border-l-4",
        !notification.read ? meta.border : "border-l-transparent",
        !notification.read && "bg-primary/[0.04]"
      )}
    >
      <button
        type="button"
        className="flex w-full gap-3 px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
        onClick={() => go(notification.href)}
        aria-label={`${notification.title}. ${notification.message}`}
      >
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            meta.iconBg
          )}
        >
          {CatIcon ? <CatIcon className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug text-text">
              {notification.title}
            </p>
            {!notification.read && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-subtext">
            {notification.message}
          </p>
          <p className="mt-1.5 text-[11px] text-subtext/80">{timeLabel}</p>
        </div>
      </button>

      <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (action.id === "dismiss") {
                onDismiss(notification.id);
                return;
              }
              if (action.id === "read" || action.id === "mark-read") {
                onMarkRead(notification.id);
                return;
              }
              onAction?.(notification.id, action.id);
              if (action.href) go(action.href);
              else onMarkRead(notification.id);
            }}
            className={cn(
              "rounded-lg px-2 py-1 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              action.id === "dismiss"
                ? "text-subtext hover:bg-white/5 hover:text-text"
                : "bg-white/5 text-text hover:bg-primary/20 hover:text-primary"
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
    </motion.article>
  );
}
