"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { SalaryAnalysis } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

interface SalaryCardProps {
  analysis: SalaryAnalysis;
  index?: number;
}

export function SalaryCard({ analysis, index = 0 }: SalaryCardProps) {
  const underBudget = analysis.difference >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{analysis.candidateName}</p>
            <p className="text-sm text-subtext">Salary compatibility</p>
          </div>
          <div className="rounded-2xl bg-primary/15 p-2.5 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-surface/60 p-3">
            <p className="text-xs text-subtext">Budget</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">
              {formatCurrency(analysis.companyBudget)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface/60 p-3">
            <p className="text-xs text-subtext">Expectation</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">
              {formatCurrency(analysis.candidateExpectation)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface/60 p-3">
            <p className="text-xs text-subtext">Difference</p>
            <p
              className={cn(
                "mt-1 flex items-center justify-center gap-1 text-sm font-semibold tabular-nums",
                underBudget ? "text-accent" : "text-danger"
              )}
            >
              {underBudget ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
              {formatCurrency(Math.abs(analysis.difference))}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-subtext">
            <span>Compatibility</span>
            <span>{analysis.compatibility}%</span>
          </div>
          <Progress
            value={analysis.compatibility}
            indicatorClassName={
              analysis.compatibility >= 85
                ? "from-accent to-secondary"
                : analysis.compatibility >= 70
                  ? "from-primary to-secondary"
                  : "from-warning to-danger"
            }
          />
        </div>
      </Card>
    </motion.div>
  );
}
