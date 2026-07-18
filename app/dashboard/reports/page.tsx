"use client";

import { useEffect, useState } from "react";
import type {
  HiringRecommendation,
  SalaryAnalysis,
  SkillGapData,
  RecruitmentSummary,
} from "@/types";
import {
  getHiringRecommendations,
  getSalaryAnalyses,
  getSkillGap,
  getRecruitmentSummary,
} from "@/services/reports";
import { RecommendationPanel } from "@/features/recruitment/RecommendationPanel";
import { SalaryCard } from "@/features/recruitment/SalaryCard";
import { SkillRadar } from "@/features/recruitment/SkillRadar";
import { SummaryCard } from "@/components/ui/summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Target, Percent, DollarSign } from "lucide-react";

export default function ReportsPage() {
  const [recs, setRecs] = useState<HiringRecommendation[]>([]);
  const [salaries, setSalaries] = useState<SalaryAnalysis[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null);
  const [summary, setSummary] = useState<RecruitmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHiringRecommendations(),
      getSalaryAnalyses(),
      getSkillGap(),
      getRecruitmentSummary(),
    ]).then(([r, s, g, sum]) => {
      if (r.success) setRecs(r.data);
      if (s.success) setSalaries(s.data);
      if (g.success) setSkillGap(g.data);
      if (sum.success) setSummary(sum.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Reports
        </h1>
        <p className="mt-1 text-subtext">
          Hiring recommendations, salary fit, and skill gap insights
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-[24px]" />
      ) : (
        <>
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Candidates"
                value={summary.candidates}
                icon={Users}
              />
              <SummaryCard
                label="Top Matches"
                value={summary.topMatches}
                icon={Target}
                delay={0.05}
              />
              <SummaryCard
                label="Avg Match"
                value={summary.averageMatch}
                suffix="%"
                icon={Percent}
                delay={0.1}
              />
              <SummaryCard
                label="Budget"
                value={summary.budget}
                prefix="$"
                icon={DollarSign}
                delay={0.15}
              />
            </div>
          )}

          <section>
            <h2 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
              Hiring Recommendation
            </h2>
            <RecommendationPanel recommendations={recs} />
          </section>

          {skillGap && <SkillRadar data={skillGap} />}

          <section>
            <h2 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
              Salary Analysis
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {salaries.map((a, i) => (
                <SalaryCard key={a.candidateId} analysis={a} index={i} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
