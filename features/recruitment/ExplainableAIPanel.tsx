"use client";

import { motion } from "framer-motion";
import { Brain, Info } from "lucide-react";

interface ExplainableAIPanelProps {
  explainability?: Record<string, unknown>;
  confidenceScore?: number;
}

export function ExplainableAIPanel({
  explainability,
  confidenceScore,
}: ExplainableAIPanelProps) {
  if (!explainability) return null;

  const matching = explainability.matching as
    | { weights?: Record<string, number>; method?: string; topScore?: number }
    | undefined;
  const requirement = explainability.requirement as
    | { extractedSkills?: string[]; budget?: number; provider?: string }
    | undefined;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass gradient-border rounded-[24px] p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/20 p-2.5">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
            Explainable AI
          </h3>
          <p className="text-sm text-subtext">
            How the agent pipeline scored this hiring brief
            {confidenceScore != null &&
              ` · ${Math.round(confidenceScore * 100)}% confidence`}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {requirement && (
          <div className="rounded-2xl bg-surface/50 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-subtext">
              <Info className="h-3.5 w-3.5" /> Requirements extracted
            </p>
            <p className="text-sm">
              Skills:{" "}
              <span className="text-secondary">
                {(requirement.extractedSkills || []).join(", ") || "—"}
              </span>
            </p>
            <p className="mt-1 text-sm">
              Budget:{" "}
              <span className="font-medium">${requirement.budget}/mo</span>
            </p>
            <p className="mt-1 text-xs text-subtext">
              Provider: {requirement.provider || "heuristic"}
            </p>
          </div>
        )}
        {matching?.weights && (
          <div className="rounded-2xl bg-surface/50 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-subtext">
              Match weights · {matching.method}
            </p>
            <ul className="space-y-2">
              {Object.entries(matching.weights).map(([key, value]) => (
                <li key={key} className="flex items-center gap-3 text-sm">
                  <span className="w-24 capitalize text-subtext">{key}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs">
                    {Math.round(value * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.section>
  );
}
