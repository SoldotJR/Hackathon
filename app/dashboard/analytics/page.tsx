"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData } from "@/types";
import { getAnalytics } from "@/services/analytics";
import { AnalyticsDashboard } from "@/features/analytics/AnalyticsDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then((res) => {
      if (res.success) setData(res.data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-subtext">
          Candidate distribution, skill match, and recruitment velocity
        </p>
      </div>

      {data ? (
        <AnalyticsDashboard data={data} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-[24px]" />
          ))}
        </div>
      )}
    </div>
  );
}
