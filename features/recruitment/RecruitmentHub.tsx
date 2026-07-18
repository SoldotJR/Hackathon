"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HubTabs } from "@/components/ui/hub-tabs";
import { HiringRequestForm } from "@/features/recruitment/HiringRequestForm";
import { RecruitmentResults } from "@/features/recruitment/RecruitmentResults";
import { LoadingWorkflow } from "@/features/workflow/LoadingWorkflow";
import { useRecruitmentStore } from "@/store/recruitment-store";
import { SchedulingPanel } from "@/features/interview-scheduling/SchedulingPanel";
import { EvaluationPanel } from "@/features/interview-evaluation/EvaluationPanel";
import { OfferPanel } from "@/features/offer-management/OfferPanel";
import { RecommendationPanel } from "@/features/recruitment/RecommendationPanel";
import { ActivityTimelinePanel } from "@/features/activity-timeline/ActivityTimelinePanel";
import { getAutomationPipeline, getHiringRecommendationsSafe } from "@/services/hub-data";
import { AutomationWorkflowGraph } from "@/features/workflow/AutomationWorkflowGraph";
import type { AutomationAgent } from "@/types/automation";
import type { HiringRecommendation } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "workflow", label: "Workflow" },
  { id: "interview", label: "Interview" },
  { id: "evaluation", label: "Evaluation" },
  { id: "offer", label: "Offer Letter" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "Timeline" },
];

export function RecruitmentHub() {
  const search = useSearchParams();
  const initial = search.get("tab") || "overview";
  const [tab, setTab] = useState(initial);
  const { phase, agents, activeAgentId, plan } = useRecruitmentStore();
  const [pipeline, setPipeline] = useState<AutomationAgent[]>([]);
  const [recs, setRecs] = useState<HiringRecommendation[]>([]);

  useEffect(() => {
    const t = search.get("tab");
    if (t) setTab(t);
  }, [search]);

  useEffect(() => {
    getAutomationPipeline().then((r) => r.success && setPipeline(r.data));
    getHiringRecommendationsSafe().then(setRecs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Recruitment
        </h1>
        <p className="mt-1 text-subtext">
          One hiring workspace — request, workflow, interview, evaluation, and offer
        </p>
      </div>

      <HubTabs tabs={TABS} active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "overview" && (
            <div className="space-y-8">
              {phase === "idle" && <HiringRequestForm />}
              {phase === "processing" && (
                <LoadingWorkflow agents={agents} activeAgentId={activeAgentId} />
              )}
              {phase === "complete" && <RecruitmentResults />}
              {phase === "idle" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hiring tip</CardTitle>
                    <CardDescription>
                      After generating a plan, use the Interview, Evaluation, and Offer
                      tabs without leaving this page.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          )}

          {tab === "workflow" && (
            <div className="space-y-4">
              {pipeline.length ? (
                <AutomationWorkflowGraph agents={pipeline} />
              ) : (
                <Skeleton className="h-[520px] rounded-[24px]" />
              )}
            </div>
          )}

          {tab === "interview" && <SchedulingPanel />}
          {tab === "evaluation" && <EvaluationPanel />}
          {tab === "offer" && <OfferPanel />}

          {tab === "documents" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiring documents</CardTitle>
                  <CardDescription>
                    Recommendations and offer artifacts for the current plan
                  </CardDescription>
                </CardHeader>
              </Card>
              {(plan?.recommendations?.length ? plan.recommendations : recs).length >
              0 ? (
                <RecommendationPanel
                  recommendations={
                    plan?.recommendations?.length ? plan.recommendations : recs
                  }
                />
              ) : (
                <p className="text-sm text-subtext">
                  Generate a recruitment plan first to unlock documents.
                </p>
              )}
            </div>
          )}

          {tab === "timeline" && <ActivityTimelinePanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
