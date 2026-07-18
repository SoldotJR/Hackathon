"use client";

import { HiringRequestForm } from "@/features/recruitment/HiringRequestForm";
import { RecruitmentResults } from "@/features/recruitment/RecruitmentResults";
import { LoadingWorkflow } from "@/features/workflow/LoadingWorkflow";
import { useRecruitmentStore } from "@/store/recruitment-store";

export default function RecruitmentPage() {
  const { phase, agents, activeAgentId } = useRecruitmentStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Recruitment
        </h1>
        <p className="mt-1 text-subtext">
          Generate an autonomous multi-agent hiring plan from a natural language
          request
        </p>
      </div>

      {phase === "idle" && <HiringRequestForm />}
      {phase === "processing" && (
        <LoadingWorkflow agents={agents} activeAgentId={activeAgentId} />
      )}
      {phase === "complete" && <RecruitmentResults />}
    </div>
  );
}
