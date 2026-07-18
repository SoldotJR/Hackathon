"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import type { HiringRecommendation } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recommendationColor } from "@/utils/recommendation";
import { cn } from "@/utils/cn";

interface RecommendationPanelProps {
  recommendations: HiringRecommendation[];
}

const riskColor = {
  Low: "text-accent",
  Medium: "text-warning",
  High: "text-danger",
};

export function RecommendationPanel({
  recommendations,
}: RecommendationPanelProps) {
  return (
    <div className="space-y-4">
      {recommendations.map((rec, i) => (
        <motion.div
          key={rec.candidateId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-subtext">AI Recommendation</p>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                  {rec.candidateName}
                </h3>
              </div>
              <Badge className={recommendationColor(rec.level)}>
                {rec.level}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-white/85">
              {rec.reasoning}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-accent/5 p-4 ring-1 ring-accent/20">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
                  <CheckCircle2 className="h-4 w-4" /> Pros
                </p>
                <ul className="space-y-1.5 text-sm text-subtext">
                  {rec.pros.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-danger/5 p-4 ring-1 ring-danger/20">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-danger">
                  <AlertTriangle className="h-4 w-4" /> Cons
                </p>
                <ul className="space-y-1.5 text-sm text-subtext">
                  {rec.cons.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-subtext" />
              <span className="text-subtext">Risk Level:</span>
              <span className={cn("font-semibold", riskColor[rec.riskLevel])}>
                {rec.riskLevel}
              </span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
