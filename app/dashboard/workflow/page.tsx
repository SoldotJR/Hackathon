"use client";

import { useEffect, useState } from "react";
import type { WorkflowAgent } from "@/types";
import type { AutomationAgent } from "@/types/automation";
import { getWorkflowAgents } from "@/services/recruitment";
import { getAutomationPipeline } from "@/services/automation";
import { WorkflowGraph } from "@/features/workflow/WorkflowGraph";
import { AutomationWorkflowGraph } from "@/features/workflow/AutomationWorkflowGraph";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function WorkflowPage() {
  const [agents, setAgents] = useState<WorkflowAgent[]>([]);
  const [autoAgents, setAutoAgents] = useState<AutomationAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWorkflowAgents(), getAutomationPipeline()]).then(
      ([res, auto]) => {
        if (res.success) {
          setAgents(
            res.data.map((a) => ({
              ...a,
              status: "completed" as const,
              progress: 100,
            }))
          );
        }
        if (auto.success) setAutoAgents(auto.data);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          AI Workflow
        </h1>
        <p className="mt-1 text-subtext">
          Multi-agent recruitment orchestration — screening to autonomous follow-up
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Autonomous Pipeline</CardTitle>
          <CardDescription>
            From application to offer — Master Agent orchestrates communication,
            scheduling, reminders, evaluation, and follow-up.
          </CardDescription>
        </CardHeader>
        <div className="mb-4 flex flex-wrap gap-2">
          {autoAgents.map((a) => (
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
              {a.label}
            </Badge>
          ))}
        </div>
        {loading ? (
          <Skeleton className="h-[640px] w-full rounded-[24px]" />
        ) : (
          <AutomationWorkflowGraph agents={autoAgents} />
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Screening Agents</CardTitle>
          <CardDescription>
            Original recruitment agents — run a live simulation from Recruitment.
          </CardDescription>
        </CardHeader>
        <div className="mb-4 flex flex-wrap gap-2">
          {agents.map((a) => (
            <Badge
              key={a.id}
              className="border-accent/30 bg-accent/10 text-accent"
            >
              {a.label}
            </Badge>
          ))}
        </div>
        {loading ? (
          <Skeleton className="h-[480px] w-full rounded-[24px]" />
        ) : (
          <WorkflowGraph agents={agents} className="!h-[520px]" />
        )}
      </Card>
    </div>
  );
}
