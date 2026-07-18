"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { getNotifications } from "@/services/automation";
import { normalizeNotifications } from "@/services/normalize-notifications";
import { useNotificationStore } from "@/store/notification-store";
import { cn } from "@/utils/cn";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const ref = useRef<HTMLDivElement>(null);

  const items = useNotificationStore((s) => s.items);
  const hydrated = useNotificationStore((s) => s.hydrated);
  const setItems = useNotificationStore((s) => s.setItems);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dismiss = useNotificationStore((s) => s.dismiss);

  useEffect(() => {
    if (hydrated) return;
    getNotifications().then((res) => {
      if (res.success) setItems(normalizeNotifications(res.data));
    });
  }, [hydrated, setItems]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const unread = items.filter((n) => !n.read).length;
  const filtered = useMemo(
    () => (filter === "unread" ? items.filter((n) => !n.read) : items),
    [items, filter]
  );

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close notifications" : "Open notifications"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <NotificationBadge count={unread} />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="glass absolute right-0 top-12 z-50 w-[min(100vw-1.5rem,360px)] overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Notifications</h2>
                {unread > 0 && (
                  <span className="text-xs text-subtext">{unread} new</span>
                )}
              </div>
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-subtext hover:text-text"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Read all
              </button>
            </div>

            <div className="flex gap-1 px-3 pt-2">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs capitalize transition",
                    filter === f
                      ? "bg-primary/20 text-white"
                      : "text-subtext hover:text-text"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-subtext">
                  You&apos;re all caught up
                </p>
              ) : (
                <ul>
                  {filtered.map((n) => (
                    <li key={n.id}>
                      <NotificationCard
                        notification={n}
                        onDismiss={dismiss}
                        onMarkRead={markRead}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
