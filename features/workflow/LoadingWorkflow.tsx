"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import type { WorkflowAgent } from "@/types";
import { Progress } from "@/components/ui/progress";
import { WorkflowGraph } from "./WorkflowGraph";
import { cn } from "@/utils/cn";

interface LoadingWorkflowProps {
  agents: WorkflowAgent[];
  activeAgentId: string | null;
}

export function LoadingWorkflow({
  agents,
  activeAgentId,
}: LoadingWorkflowProps) {
  const completed = agents.filter((a) => a.status === "completed").length;
  const total = agents.length || 1;
  const overall = Math.round((completed / total) * 100);
  const active = agents.find((a) => a.id === activeAgentId);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[24px] p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
              <Bot className="h-6 w-6 text-primary" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 animate-pulse text-secondary" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                AI Agents Working
              </h2>
              <p className="text-sm text-subtext">
                {active
                  ? `${active.label} is processing…`
                  : "Finalizing recruitment plan…"}
              </p>
            </div>
          </div>
          <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-primary">
            {overall}%
          </p>
        </div>
        <Progress value={overall} className="mt-4 h-2.5" />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <WorkflowGraph agents={agents} />

        <div className="glass space-y-2 rounded-[24px] p-4">
          <p className="mb-3 text-sm font-medium text-subtext">Pipeline</p>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={cn(
                "rounded-xl px-3 py-2.5 text-sm transition",
                agent.status === "running" && "bg-primary/15 text-white",
                agent.status === "completed" && "text-accent",
                agent.status === "pending" && "text-subtext"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{agent.label}</span>
                <span className="text-xs capitalize opacity-70">
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
