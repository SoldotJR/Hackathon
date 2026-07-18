"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface HubTab {
  id: string;
  label: string;
}

export function HubTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: HubTab[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-surface/40 p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition",
              isActive ? "text-white" : "text-subtext hover:text-text"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="hub-tab"
                className="absolute inset-0 rounded-xl bg-primary/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
