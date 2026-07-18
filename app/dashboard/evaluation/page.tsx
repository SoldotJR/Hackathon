"use client";

import { EvaluationPanel } from "@/features/interview-evaluation/EvaluationPanel";

export default function EvaluationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Interview Evaluation
        </h1>
        <p className="mt-1 text-subtext">
          Turn interviewer notes into scores, summary, and recommendation
        </p>
      </div>
      <EvaluationPanel />
    </div>
  );
}
