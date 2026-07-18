"use client";

import { Suspense } from "react";
import { AutomationCenter } from "@/features/automation/AutomationCenter";
import { Skeleton } from "@/components/ui/skeleton";

export default function AutomationPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-[24px]" />}>
      <AutomationCenter />
    </Suspense>
  );
}
