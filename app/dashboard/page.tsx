"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Percent,
  Briefcase,
  ArrowRight,
  Clock,
  TrendingUp,
  Mail,
  Hourglass,
  UserRound,
  FileSignature,
  Zap,
} from "lucide-react";
import type { DashboardStats, Candidate } from "@/types";
import type { AutomationStats } from "@/types/automation";
import { getDashboardStats } from "@/services/analytics";
import { getAutomationStats } from "@/services/automation";
import { getTopCandidates } from "@/services/candidates";
import { SummaryCard } from "@/components/ui/summary-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/features/candidates/CandidateCard";
import { CandidateDetailsModal } from "@/features/candidates/CandidateDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [autoStats, setAutoStats] = useState<AutomationStats | null>(null);
  const [top, setTop] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    getDashboardStats().then((r) => r.success && setStats(r.data));
    getAutomationStats().then((r) => r.success && setAutoStats(r.data));
    getTopCandidates(3).then((r) => r.success && setTop(r.data));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-subtext">
            Overview of your agentic recruitment pipeline
          </p>
        </div>
        <Link href="/dashboard/recruitment">
          <Button>
            New Hiring Request
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Active Requests" value={stats.activeRequests} icon={Briefcase} />
          <SummaryCard label="Total Candidates" value={stats.totalCandidates} icon={Users} delay={0.05} />
          <SummaryCard label="Interviews Scheduled" value={stats.interviewsScheduled} icon={Calendar} delay={0.1} />
          <SummaryCard label="Avg Match Score" value={stats.avgMatchScore} suffix="%" icon={Percent} delay={0.15} />
          <SummaryCard label="Hire Rate" value={stats.hireRate} suffix="%" icon={TrendingUp} delay={0.2} />
          <SummaryCard label="Time to Hire" value={stats.timeToHire} suffix=" days" icon={Clock} delay={0.25} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[24px]" />
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Automation Today
        </h2>
        {autoStats ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard label="Emails Sent Today" value={autoStats.emailsSentToday} icon={Mail} />
            <SummaryCard label="Pending Follow-ups" value={autoStats.pendingFollowUps} icon={Hourglass} delay={0.05} />
            <SummaryCard label="Upcoming Interviews" value={autoStats.upcomingInterviews} icon={Calendar} delay={0.1} />
            <SummaryCard label="Candidates Waiting" value={autoStats.candidatesWaiting} icon={UserRound} delay={0.15} />
            <SummaryCard label="Offer Letters Sent" value={autoStats.offerLettersSent} icon={FileSignature} delay={0.2} />
            <SummaryCard label="Automation Success" value={autoStats.automationSuccessRate} suffix="%" icon={Zap} delay={0.25} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={`a-${i}`} className="h-28 rounded-[24px]" />
            ))}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
              Start a recruitment plan
            </h2>
            <p className="mt-1 text-sm text-subtext">
              Paste a hiring request and watch multi-agent orchestration in action.
            </p>
          </div>
          <Link href="/dashboard/recruitment">
            <Button variant="secondary">Open Recruitment</Button>
          </Link>
        </Card>
      </motion.div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
            Top Matches
          </h2>
          <Link href="/dashboard/candidates" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {top.map((c, i) => (
            <CandidateCard key={c.id} candidate={c} index={i} onViewDetails={setSelected} />
          ))}
        </div>
      </section>

      <CandidateDetailsModal
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
