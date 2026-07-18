import type {
  AppNotification,
  NotificationCategory,
  NotificationKind,
} from "@/types/notifications";

const KINDS: NotificationKind[] = [
  "success",
  "error",
  "info",
  "warning",
  "ai",
];
const CATEGORIES: NotificationCategory[] = [
  "recruitment",
  "automation",
  "emails",
  "system",
];

export function normalizeNotification(
  raw: Record<string, unknown>
): AppNotification {
  const type = KINDS.includes(raw.type as NotificationKind)
    ? (raw.type as NotificationKind)
    : "info";
  const category = CATEGORIES.includes(raw.category as NotificationCategory)
    ? (raw.category as NotificationCategory)
    : type === "ai"
      ? "automation"
      : "system";

  return {
    id: String(raw.id ?? `n-${Date.now()}`),
    title: String(raw.title ?? "Notification"),
    message: String(raw.message ?? ""),
    type,
    category,
    read: Boolean(raw.read),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    href: raw.href ? String(raw.href) : undefined,
    candidateName: raw.candidateName
      ? String(raw.candidateName)
      : undefined,
    actions: Array.isArray(raw.actions)
      ? (raw.actions as AppNotification["actions"])
      : undefined,
  };
}

export function normalizeNotifications(
  list: unknown
): AppNotification[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) =>
    normalizeNotification((item ?? {}) as Record<string, unknown>)
  );
}
