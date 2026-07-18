"use client";

import { SchedulingPanel } from "@/features/interview-scheduling/SchedulingPanel";

export default function SchedulingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Interview Scheduling
        </h1>
        <p className="mt-1 text-subtext">
          Suggest mutual slots, timezones, and Meet links
        </p>
      </div>
      <SchedulingPanel />
    </div>
  );
}
