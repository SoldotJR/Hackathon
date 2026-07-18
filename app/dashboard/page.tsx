"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  ArrowRight,
  Mail,
  Hourglass,
  Zap,
  Bell,
  Upload,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Candidate } from "@/types";
import type { AutomationStats, InterviewReminder, ActivityEvent } from "@/types/automation";
import { getAutomationStats, getReminders, getActivity } from "@/services/automation";
import { getTopCandidates, getCandidates } from "@/services/candidates";
import { SummaryCard } from "@/components/ui/summary-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidateCard } from "@/features/candidates/CandidateCard";
import { CandidateDetailsModal } from "@/features/candidates/CandidateDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [autoStats, setAutoStats] = useState<AutomationStats | null>(null);
  const [top, setTop] = useState<Candidate[]>([]);
  const [newCandidates, setNewCandidates] = useState<Candidate[]>([]);
  const [reminders, setReminders] = useState<InterviewReminder[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    getAutomationStats().then((r) => r.success && setAutoStats(r.data));
    getTopCandidates(3).then((r) => r.success && setTop(r.data));
    getCandidates().then((r) => {
      if (r.success) setNewCandidates(r.data.slice(0, 4));
    });
    getReminders().then((r) => r.success && setReminders(r.data.slice(0, 4)));
    getActivity().then((r) => r.success && setActivity(r.data.slice(0, 6)));
  }, []);

  const interviewsToday = autoStats?.upcomingInterviews ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-subtext">
            Today&apos;s hiring pulse — interviews, candidates, and AI automation
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/recruitment">
            <Button>
              New Recruitment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {autoStats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Today's Interviews" value={interviewsToday} icon={Calendar} />
          <SummaryCard
            label="New Candidates"
            value={newCandidates.length}
            icon={Users}
            delay={0.05}
          />
          <SummaryCard
            label="Pending Approvals"
            value={autoStats.candidatesWaiting}
            icon={Hourglass}
            delay={0.1}
          />
          <SummaryCard
            label="Emails Sent"
            value={autoStats.emailsSentToday}
            icon={Mail}
            delay={0.15}
          />
          <SummaryCard
            label="Automation Success"
            value={autoStats.automationSuccessRate}
            suffix="%"
            icon={Zap}
            delay={0.2}
          />
          <SummaryCard
            label="Upcoming Reminders"
            value={reminders.filter((r) => r.status === "Upcoming").length || autoStats.pendingFollowUps}
            icon={Bell}
            delay={0.25}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[24px]" />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard/recruitment">
            <Card className="h-full transition hover:border-primary/40 hover:bg-white/[0.03]">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">New Recruitment</CardTitle>
                <CardDescription>Start a hiring request and AI workflow</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/recruitment?tab=overview">
            <Card className="h-full transition hover:border-primary/40 hover:bg-white/[0.03]">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Upload className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Upload CV</CardTitle>
                <CardDescription>Parse resumes into the candidate pool</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/reports">
            <Card className="h-full transition hover:border-primary/40 hover:bg-white/[0.03]">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Generate Report</CardTitle>
                <CardDescription>Export PDF, Excel, or CSV from Export Center</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming reminders</CardTitle>
            <CardDescription>Interview nudges queued by the Reminder Agent</CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {reminders.length === 0 && (
              <li className="text-sm text-subtext">Loading reminders…</li>
            )}
            {reminders.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-surface/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.candidateName}</p>
                  <p className="text-xs text-subtext">
                    {r.offsetLabel} · {new Date(r.interviewAt).toLocaleString()}
                  </p>
                </div>
                <Badge className="shrink-0 border-white/10 bg-white/5 text-subtext">
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/automation?tab=reminders"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Open Automation Center
          </Link>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI activities</CardTitle>
            <CardDescription>Latest autonomous agent actions</CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {activity.length === 0 && (
              <li className="text-sm text-subtext">Loading activity…</li>
            )}
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-subtext">
                    {a.description} · {a.agent} · {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/automation?tab=timeline"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            View full timeline
          </Link>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
            New candidates
          </h2>
          <Link href="/dashboard/candidates" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(top.length ? top : newCandidates).map((c, i) => (
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
