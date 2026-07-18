"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Check, Loader2, Circle } from "lucide-react";
import type { AutomationAgent } from "@/types/automation";
import { cn } from "@/utils/cn";

function AutoNode({ data }: NodeProps) {
  const status = data.status as AutomationAgent["status"];
  const label = data.label as string;
  const progress = data.progress as number;

  return (
    <div
      className={cn(
        "min-w-[200px] rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md",
        status === "running" && "border-primary/60 bg-primary/15",
        status === "completed" && "border-accent/50 bg-accent/10",
        status === "pending" && "border-white/10 bg-card/90",
        status === "error" && "border-danger/50 bg-danger/10"
      )}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-none !bg-primary" />
      <div className="flex items-center gap-2">
        {status === "completed" && <Check className="h-4 w-4 text-accent" />}
        {status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {status === "pending" && <Circle className="h-3.5 w-3.5 text-subtext" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {status === "running" && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-none !bg-secondary" />
    </div>
  );
}

const nodeTypes = { auto: AutoNode };

export function AutomationWorkflowGraph({
  agents,
  className,
}: {
  agents: AutomationAgent[];
  className?: string;
}) {
  const nodes: Node[] = useMemo(
    () =>
      agents.map((agent, i) => ({
        id: agent.id,
        type: "auto",
        position: {
          x: i % 2 === 0 ? 60 : 320,
          y: i * 100,
        },
        data: {
          label: agent.label,
          status: agent.status,
          progress: agent.progress,
        },
      })),
    [agents]
  );

  const edges: Edge[] = useMemo(
    () =>
      agents.slice(0, -1).map((agent, i) => {
        const next = agents[i + 1];
        const active =
          agent.status === "completed" || agent.status === "running";
        return {
          id: `${agent.id}-${next.id}`,
          source: agent.id,
          target: next.id,
          animated: agent.status === "running",
          style: {
            stroke: active ? "#6366F1" : "rgba(255,255,255,0.15)",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: active ? "#6366F1" : "rgba(255,255,255,0.25)",
          },
        };
      }),
    [agents]
  );

  return (
    <div className={cn("h-[720px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-card/40", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={24} size={1} color="rgba(255,255,255,0.04)" />
        <Controls showInteractive={false} className="!overflow-hidden !rounded-xl !border-white/10 !bg-card/90" />
      </ReactFlow>
    </div>
  );
}
