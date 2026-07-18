"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  meta?: string;
  tone?: "success" | "pending" | "error" | "scheduled" | "warning" | "default";
}

const toneDot: Record<NonNullable<TimelineItem["tone"]>, string> = {
  success: "bg-accent",
  pending: "bg-warning",
  warning: "bg-warning",
  error: "bg-danger",
  scheduled: "bg-secondary",
  default: "bg-primary",
};

export function SimpleTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-0 border-l border-white/10 pl-6">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="relative pb-8 last:pb-0"
        >
          <span
            className={cn(
              "absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background",
              toneDot[item.tone ?? "default"]
            )}
          />
          <p className="text-xs font-medium text-secondary">{item.time}</p>
          <p className="mt-0.5 font-medium">{item.title}</p>
          {item.description && (
            <p className="mt-1 text-sm text-subtext">{item.description}</p>
          )}
          {item.meta && (
            <p className="mt-1 text-xs text-subtext/80">{item.meta}</p>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
