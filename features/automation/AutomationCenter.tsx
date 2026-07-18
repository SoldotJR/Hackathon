"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HubTabs } from "@/components/ui/hub-tabs";
import { CommunicationPanel } from "@/features/candidate-communication/CommunicationPanel";
import { ReminderPanel } from "@/features/interview-reminder/ReminderPanel";
import { FollowUpPanel } from "@/features/candidate-followup/FollowUpPanel";
import { ActivityTimelinePanel } from "@/features/activity-timeline/ActivityTimelinePanel";
import { AutomationWorkflowGraph } from "@/features/workflow/AutomationWorkflowGraph";
import { getAutomationPipeline, getAutomationStats } from "@/services/automation";
import type { AutomationAgent, AutomationStats } from "@/types/automation";
import { SummaryCard } from "@/components/ui/summary-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Bot, Zap, Activity } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "communication", label: "Communication" },
  { id: "reminders", label: "Reminders" },
  { id: "followup", label: "Follow-up" },
  { id: "workflow", label: "Workflow" },
  { id: "agents", label: "Agent Status" },
  { id: "timeline", label: "Activity" },
  { id: "logs", label: "Logs" },
];

export function AutomationCenter() {
  const search = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") || "overview");
  const [pipeline, setPipeline] = useState<AutomationAgent[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);

  useEffect(() => {
    const t = search.get("tab");
    if (t) setTab(t);
  }, [search]);

  useEffect(() => {
    getAutomationPipeline().then((r) => r.success && setPipeline(r.data));
    getAutomationStats().then((r) => r.success && setStats(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Automation Center
        </h1>
        <p className="mt-1 text-subtext">
          All autonomous agents, emails, reminders, and logs in one place
        </p>
      </div>

      <HubTabs tabs={TABS} active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "overview" && (
            <div className="space-y-6">
              {stats ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <SummaryCard label="Emails Sent Today" value={stats.emailsSentToday} icon={Mail} />
                  <SummaryCard label="Pending Follow-ups" value={stats.pendingFollowUps} icon={Activity} delay={0.05} />
                  <SummaryCard label="Automation Success" value={stats.automationSuccessRate} suffix="%" icon={Zap} delay={0.1} />
                </div>
              ) : (
                <Skeleton className="h-28 rounded-[24px]" />
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Running agents</CardTitle>
                  <CardDescription>Live status of the autonomous pipeline</CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {pipeline.map((a) => (
                    <Badge
                      key={a.id}
                      className={
                        a.status === "completed"
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : a.status === "running"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-white/10 bg-white/5 text-subtext"
                      }
                    >
                      <Bot className="mr-1 h-3 w-3" />
                      {a.label}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          )}
          {tab === "communication" && <CommunicationPanel />}
          {tab === "reminders" && <ReminderPanel />}
          {tab === "followup" && <FollowUpPanel />}
          {tab === "workflow" &&
            (pipeline.length ? (
              <AutomationWorkflowGraph agents={pipeline} />
            ) : (
              <Skeleton className="h-[520px] rounded-[24px]" />
            ))}
          {tab === "agents" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {pipeline.map((a) => (
                <Card key={a.id} hover={false}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{a.label}</p>
                      <p className="text-xs text-subtext">{a.description}</p>
                    </div>
                    <Badge className="border-white/10 bg-white/5 capitalize">
                      {a.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {tab === "timeline" && <ActivityTimelinePanel />}
          {tab === "logs" && (
            <Card>
              <CardHeader>
                <CardTitle>Automation logs</CardTitle>
                <CardDescription>Recent agent events</CardDescription>
              </CardHeader>
              <ul className="space-y-2 font-mono text-xs text-subtext">
                <li>[info] Master Agent orchestrated communication pipeline</li>
                <li>[info] Acknowledgement email delivered · Emily Johnson</li>
                <li>[info] Reminder Agent queued 24h / 1h / 10m jobs</li>
                <li>[warn] Follow-up Agent · Marcus Chen day-3 reminder sent</li>
                <li>[info] Offer Letter Agent draft ready for approval</li>
              </ul>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
