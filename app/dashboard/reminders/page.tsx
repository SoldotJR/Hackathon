"use client";

import { ReminderPanel } from "@/features/interview-reminder/ReminderPanel";

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Interview Reminders
        </h1>
        <p className="mt-1 text-subtext">
          Automatic 24h, 1h, and 10-minute reminders before interviews
        </p>
      </div>
      <ReminderPanel />
    </div>
  );
}
