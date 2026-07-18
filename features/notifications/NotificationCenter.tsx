"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  Search,
  Trash2,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { getNotifications } from "@/services/automation";
import { normalizeNotifications } from "@/services/normalize-notifications";
import { useNotificationStore } from "@/store/notification-store";
import { notify } from "@/services/notifications";
import type { NotificationCategory } from "@/types/notifications";
import { cn } from "@/utils/cn";

type FilterId = "all" | "unread" | NotificationCategory;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "recruitment", label: "Recruitment" },
  { id: "automation", label: "Automation" },
  { id: "emails", label: "Emails" },
  { id: "system", label: "System" },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const items = useNotificationStore((s) => s.items);
  const hydrated = useNotificationStore((s) => s.hydrated);
  const setItems = useNotificationStore((s) => s.setItems);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dismiss = useNotificationStore((s) => s.dismiss);
  const clearRead = useNotificationStore((s) => s.clearRead);
  const refresh = useNotificationStore((s) => s.refresh);

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

  const filtered = useMemo(() => {
    let list = [...items];
    if (filter === "unread") list = list.filter((n) => !n.read);
    else if (filter !== "all") list = list.filter((n) => n.category === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.candidateName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filter, query]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await getNotifications();
      if (res.success) {
        const remote = normalizeNotifications(res.data);
        const localOnly = items.filter(
          (i) => !remote.some((r) => r.id === i.id)
        );
        refresh(
          [...localOnly, ...remote].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        notify.info("Notifications refreshed", "Latest updates loaded.", {
          skipCenter: true,
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close notifications" : "Open notifications"}
        aria-expanded={open}
        aria-haspopup="dialog"
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
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="glass absolute right-0 top-12 z-50 flex w-[min(100vw-1.5rem,420px)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="border-b border-white/10 px-4 pb-3 pt-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-[family-name:var(--font-syne)] text-base font-semibold">
                    Notifications
                  </h2>
                  {unread > 0 && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {unread} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Mark all as read"
                    title="Mark all as read"
                    onClick={markAllRead}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Clear read notifications"
                    title="Clear read"
                    onClick={clearRead}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Refresh notifications"
                    title="Refresh"
                    onClick={onRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={cn("h-4 w-4", refreshing && "animate-spin")}
                    />
                  </Button>
                </div>
              </div>

              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtext" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notifications…"
                  className="h-9 pl-9 text-sm"
                  aria-label="Search notifications"
                />
              </div>

              <div
                role="tablist"
                aria-label="Filter notifications"
                className="flex gap-1 overflow-x-auto pb-0.5"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      filter === f.id
                        ? "bg-primary/25 text-white"
                        : "text-subtext hover:bg-white/5 hover:text-text"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center px-4 py-12 text-center"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <PartyPopper className="h-6 w-6" />
                    </div>
                    <p className="font-[family-name:var(--font-syne)] text-sm font-semibold">
                      You&apos;re all caught up!
                    </p>
                    <p className="mt-1 text-xs text-subtext">
                      No new notifications.
                    </p>
                  </motion.div>
                ) : (
                  <ul className="space-y-2">
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
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
