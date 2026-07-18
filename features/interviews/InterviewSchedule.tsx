"use client";

import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import type { InterviewSlot } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InterviewScheduleProps {
  slots: InterviewSlot[];
}

export function InterviewSchedule({ slots }: InterviewScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
        <CardDescription>
          Proposed timeline for top-ranked candidates
        </CardDescription>
      </CardHeader>

      <div className="relative space-y-0 pl-2">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-primary via-secondary to-accent" />

        {slots.map((slot, i) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-card text-xs font-semibold text-primary shadow-lg shadow-primary/20">
              {i + 1}
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-surface/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{slot.day}</p>
                  <p className="text-sm text-subtext">{slot.candidateName}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-subtext">
                  {slot.type}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-subtext">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {slot.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {slot.time} · {slot.duration}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
