"use client";

import { Suspense } from "react";
import { RecruitmentHub } from "@/features/recruitment/RecruitmentHub";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruitmentPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-[24px]" />}>
      <RecruitmentHub />
    </Suspense>
  );
}
