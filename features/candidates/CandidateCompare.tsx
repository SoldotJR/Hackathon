"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";
import type { Candidate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

interface CandidateCompareProps {
  candidates: Candidate[];
}

export function CandidateCompare({ candidates }: CandidateCompareProps) {
  const top = candidates.slice(0, 6);
  const [leftId, setLeftId] = useState(top[0]?.id ?? "");
  const [rightId, setRightId] = useState(top[1]?.id ?? "");

  const left = useMemo(
    () => top.find((c) => c.id === leftId) ?? top[0],
    [leftId, top]
  );
  const right = useMemo(
    () => top.find((c) => c.id === rightId) ?? top[1],
    [rightId, top]
  );

  if (!left || !right) return null;

  const rows: { label: string; a: string | number; b: string | number }[] = [
    { label: "Match", a: `${left.matchScore}%`, b: `${right.matchScore}%` },
    { label: "Experience", a: left.experienceLabel, b: right.experienceLabel },
    { label: "Salary", a: `$${left.salary}`, b: `$${right.salary}` },
    { label: "Recommendation", a: left.recommendation, b: right.recommendation },
    { label: "Location", a: left.location, b: right.location },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[24px] p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-secondary/20 p-2.5">
          <GitCompareArrows className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
            Candidate Comparison
          </h3>
          <p className="text-sm text-subtext">Side-by-side shortlist comparison</p>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <select
          aria-label="Left candidate"
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          value={left.id}
          onChange={(e) => setLeftId(e.target.value)}
        >
          {top.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Right candidate"
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          value={right.id}
          onChange={(e) => setRightId(e.target.value)}
        >
          {top.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-3 text-sm">
        <div className="font-medium">{left.name}</div>
        <div className="text-center text-xs text-subtext">vs</div>
        <div className="text-right font-medium">{right.name}</div>
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <div
              className={cn(
                "rounded-xl bg-surface/50 px-3 py-2",
                String(row.a).includes("%") &&
                  Number(String(row.a).replace("%", "")) >
                    Number(String(row.b).replace("%", "")) &&
                  "ring-1 ring-accent/40"
              )}
            >
              {row.a}
            </div>
            <div className="flex items-center justify-center">
              <Badge className="border-border text-[10px] text-subtext">
                {row.label}
              </Badge>
            </div>
            <div
              className={cn(
                "rounded-xl bg-surface/50 px-3 py-2 text-right",
                String(row.b).includes("%") &&
                  Number(String(row.b).replace("%", "")) >
                    Number(String(row.a).replace("%", "")) &&
                  "ring-1 ring-accent/40"
              )}
            >
              {row.b}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
