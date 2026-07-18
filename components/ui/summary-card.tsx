"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: LucideIcon;
  className?: string;
  delay?: number;
}

export function SummaryCard({
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  className,
  delay = 0,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-subtext">{label}</p>
            <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
          {Icon && (
            <div className="rounded-2xl bg-primary/15 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
