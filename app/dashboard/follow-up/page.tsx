"use client";

import { FollowUpPanel } from "@/features/candidate-followup/FollowUpPanel";

export default function FollowUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Follow-up Center
        </h1>
        <p className="mt-1 text-subtext">
          Monitor replies, send reminders, and mark inactive candidates
        </p>
      </div>
      <FollowUpPanel />
    </div>
  );
}
