"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Target,
  Percent,
  DollarSign,
  RotateCcw,
  Download,
  FileSpreadsheet,
  Sparkles,
  Clock,
} from "lucide-react";
import type { AnalyticsData, Candidate } from "@/types";
import { useRecruitmentStore } from "@/store/recruitment-store";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/features/candidates/CandidateCard";
import { CandidateDetailsModal } from "@/features/candidates/CandidateDetailsModal";
import { CandidateCompare } from "@/features/candidates/CandidateCompare";
import { SkillRadar } from "@/features/recruitment/SkillRadar";
import { SalaryCard } from "@/features/recruitment/SalaryCard";
import { InterviewQuestionsGrid } from "@/features/interviews/InterviewCard";
import { InterviewSchedule } from "@/features/interviews/InterviewSchedule";
import { RecommendationPanel } from "@/features/recruitment/RecommendationPanel";
import { ExplainableAIPanel } from "@/features/recruitment/ExplainableAIPanel";
import { AnalyticsDashboard } from "@/features/analytics/AnalyticsDashboard";
import { getAnalytics } from "@/services/analytics";
import { reportDownloadUrl } from "@/services/recruitment";
import { notify } from "@/services/notifications";
import { Skeleton } from "@/components/ui/skeleton";

export function RecruitmentResults() {
  const { plan, reset } = useRecruitmentStore();
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!plan) return;
    getAnalytics().then((res) => {
      if (res.success) setAnalytics(res.data);
    });
  }, [plan]);

  if (!plan) return null;

  const topCandidates = plan.candidates.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold">
            Recruitment Plan Ready
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-subtext line-clamp-2">
            {plan.request}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(reportDownloadUrl("pdf"), "_blank");
              notify.reportExported("PDF");
            }}
          >
            <Download className="h-4 w-4" />
            PDF Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(reportDownloadUrl("csv"), "_blank");
              notify.reportExported("CSV");
            }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {(plan.confidenceScore != null || plan.processingTimeMs != null) && (
        <div className="glass flex flex-wrap items-center gap-6 rounded-2xl px-5 py-4">
          {plan.confidenceScore != null && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-subtext">AI Confidence</span>
              <span className="font-semibold text-accent">
                {Math.round(plan.confidenceScore * 100)}%
              </span>
            </div>
          )}
          {plan.processingTimeMs != null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-subtext">Processing</span>
              <span className="font-semibold">
                {(plan.processingTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          )}
          {plan.explainability && (
            <p className="text-xs text-subtext">
              Explainable pipeline — each agent scored skills, salary fit, and
              seniority against your brief.
            </p>
          )}
        </div>
      )}

      {/* Section 1 — Summary */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Recruitment Summary
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-hover rounded-[24px] p-6 shadow-xl shadow-black/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-subtext">Position</p>
                <p className="mt-2 font-[family-name:var(--font-syne)] text-xl font-semibold">
                  {plan.summary.position}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
          <SummaryCard
            label="Candidates"
            value={plan.summary.candidates}
            icon={Users}
            delay={0.05}
          />
          <SummaryCard
            label="Top Matches"
            value={plan.summary.topMatches}
            icon={Target}
            delay={0.1}
          />
          <SummaryCard
            label="Average Match"
            value={plan.summary.averageMatch}
            suffix="%"
            icon={Percent}
            delay={0.15}
          />
          <SummaryCard
            label="Budget"
            value={plan.summary.budget}
            prefix="$"
            icon={DollarSign}
            delay={0.2}
          />
        </div>
      </section>

      {/* Section 2 — Ranking */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Candidate Ranking
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topCandidates.map((c, i) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              index={i}
              onViewDetails={setSelected}
            />
          ))}
        </div>
      </section>

      <CandidateCompare candidates={plan.candidates} />

      {/* Section 4 — Skill Gap */}
      <section>
        <SkillRadar data={plan.skillGap} />
      </section>

      {/* Section 5 — Interview Questions */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Interview Questions
        </h3>
        <InterviewQuestionsGrid questions={plan.interviewQuestions} />
      </section>

      {/* Section 6 — Salary */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Salary Analysis
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plan.salaryAnalyses.map((a, i) => (
            <SalaryCard key={a.candidateId} analysis={a} index={i} />
          ))}
        </div>
      </section>

      {/* Section 7 — Schedule */}
      <section>
        <InterviewSchedule slots={plan.schedule} />
      </section>

      {/* Section 8 — Recommendations */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Hiring Recommendation
        </h3>
        <RecommendationPanel recommendations={plan.recommendations} />
      </section>

      <ExplainableAIPanel
        explainability={plan.explainability}
        confidenceScore={plan.confidenceScore}
      />

      {/* Section 9 — Analytics */}
      <section>
        <h3 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Analytics
        </h3>
        {analytics ? (
          <AnalyticsDashboard data={analytics} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 rounded-[24px]" />
            <Skeleton className="h-64 rounded-[24px]" />
          </div>
        )}
      </section>

      <CandidateDetailsModal
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </motion.div>
  );
}
