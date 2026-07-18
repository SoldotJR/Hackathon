"use client";

import { create } from "zustand";
import type {
  AppNotification,
  NotificationAction,
  NotificationCategory,
  NotificationKind,
} from "@/types/notifications";

interface NotificationState {
  items: AppNotification[];
  hydrated: boolean;
  setItems: (items: AppNotification[]) => void;
  add: (item: Omit<AppNotification, "id" | "createdAt" | "read"> & {
    id?: string;
    createdAt?: string;
    read?: boolean;
  }) => AppNotification;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearRead: () => void;
  refresh: (items: AppNotification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  hydrated: false,
  setItems: (items) => set({ items, hydrated: true }),
  add: (partial) => {
    const item: AppNotification = {
      id: partial.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: partial.title,
      message: partial.message,
      type: partial.type,
      category: partial.category,
      read: partial.read ?? false,
      createdAt: partial.createdAt ?? new Date().toISOString(),
      href: partial.href,
      actions: partial.actions,
      candidateName: partial.candidateName,
    };
    set({ items: [item, ...get().items] });
    return item;
  },
  markRead: (id) =>
    set({
      items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }),
  markAllRead: () =>
    set({ items: get().items.map((n) => ({ ...n, read: true })) }),
  dismiss: (id) => set({ items: get().items.filter((n) => n.id !== id) }),
  clearRead: () => set({ items: get().items.filter((n) => !n.read) }),
  refresh: (items) => set({ items, hydrated: true }),
}));

export type { NotificationAction, NotificationCategory, NotificationKind };
