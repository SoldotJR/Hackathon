"use client";

import { useCallback, useMemo } from "react";
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
import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import type { WorkflowAgent } from "@/types";
import { cn } from "@/utils/cn";

function AgentNode({ data }: NodeProps) {
  const status = data.status as WorkflowAgent["status"];
  const label = data.label as string;
  const progress = data.progress as number;

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all",
        status === "running" &&
          "border-primary/60 bg-primary/15 shadow-primary/20",
        status === "completed" &&
          "border-accent/50 bg-accent/10 shadow-accent/10",
        status === "pending" && "border-white/10 bg-card/90",
        status === "error" && "border-danger/50 bg-danger/10"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-none !w-2 !h-2"
      />
      <div className="flex items-center gap-2">
        {status === "completed" && (
          <Check className="h-4 w-4 text-accent" />
        )}
        {status === "running" && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
        {status === "pending" && (
          <Circle className="h-3.5 w-3.5 text-subtext" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {status === "running" && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-secondary !border-none !w-2 !h-2"
      />
    </div>
  );
}

const nodeTypes = { agent: AgentNode };

interface WorkflowGraphProps {
  agents: WorkflowAgent[];
  className?: string;
}

export function WorkflowGraph({ agents, className }: WorkflowGraphProps) {
  const nodes: Node[] = useMemo(
    () =>
      agents.map((agent, i) => ({
        id: agent.id,
        type: "agent",
        position: {
          x: (i % 2 === 0 ? 40 : 280) + (i > 4 ? 20 : 0),
          y: i * 110,
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
        const done = agent.status === "completed";
        return {
          id: `${agent.id}-${next.id}`,
          source: agent.id,
          target: next.id,
          animated: agent.status === "running" || next.status === "running",
          style: {
            stroke: done ? "#22C55E" : "#4F46E5",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: done ? "#22C55E" : "#4F46E5",
          },
        };
      }),
    [agents]
  );

  const onInit = useCallback(() => {}, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "h-[640px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-card/40",
        className
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="rgba(255,255,255,0.06)" gap={20} />
        <Controls
          showInteractive={false}
          className="!bg-card !border-white/10 !shadow-lg [&>button]:!bg-card [&>button]:!border-white/10 [&>button]:!fill-white"
        />
      </ReactFlow>
    </motion.div>
  );
}
