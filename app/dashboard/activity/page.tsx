"use client";

import { ActivityTimelinePanel } from "@/features/activity-timeline/ActivityTimelinePanel";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Activity Timeline
        </h1>
        <p className="mt-1 text-subtext">
          Chronological log of every automated recruitment action
        </p>
      </div>
      <ActivityTimelinePanel />
    </div>
  );
}
