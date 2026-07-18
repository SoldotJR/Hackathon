"use client";

import { useEffect, useState } from "react";
import type { InterviewQuestion, InterviewSlot } from "@/types";
import {
  getInterviewQuestions,
  getInterviewSchedule,
} from "@/services/interviews";
import { InterviewQuestionsGrid } from "@/features/interviews/InterviewCard";
import { InterviewSchedule } from "@/features/interviews/InterviewSchedule";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewsPage() {
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInterviewSchedule(), getInterviewQuestions()]).then(
      ([s, q]) => {
        if (s.success) setSlots(s.data);
        if (q.success) setQuestions(q.data);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Interviews
        </h1>
        <p className="mt-1 text-subtext">
          Generated questions and proposed interview timeline
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-[24px]" />
          <Skeleton className="h-96 rounded-[24px]" />
        </div>
      ) : (
        <>
          <InterviewSchedule slots={slots} />
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
              Interview Questions
            </h2>
            <InterviewQuestionsGrid questions={questions} />
          </section>
        </>
      )}
    </div>
  );
}
