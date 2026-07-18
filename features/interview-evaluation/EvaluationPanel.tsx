"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getEvaluations, runEvaluation } from "@/services/automation";
import type { InterviewEvaluationResult } from "@/types/automation";
import { cn } from "@/utils/cn";

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface/50 px-3 py-3 text-center">
      <p className="text-xs text-subtext">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-syne)] text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

export function EvaluationPanel() {
  const [evals, setEvals] = useState<InterviewEvaluationResult[]>([]);
  const [name, setName] = useState("Emily Johnson");
  const [notes, setNotes] = useState(
    "Strong React fundamentals. Clear communicator. Good culture fit."
  );
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    getEvaluations().then((res) => {
      if (res.success) setEvals(res.data);
      setLoading(false);
    });
  }, []);

  const onRun = async () => {
    setRunning(true);
    try {
      const res = await runEvaluation({ candidateName: name, notes });
      if (res.success) setEvals((prev) => [res.data, ...prev]);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <Skeleton className="h-80 rounded-[24px]" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Interviewer Notes</CardTitle>
          <CardDescription>
            Evaluation Agent turns notes into scores and a recommendation
          </CardDescription>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Candidate name"
            />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[88px]"
              placeholder="Interview notes…"
            />
          </div>
          <Button onClick={onRun} disabled={running}>
            <Sparkles className="h-4 w-4" />
            {running ? "Analyzing…" : "Generate Evaluation"}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {evals.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{ev.candidateName}</h3>
                  <p className="mt-1 text-sm text-subtext">{ev.summary}</p>
                </div>
                <Badge
                  className={cn(
                    ev.recommendation === "Highly Recommended" &&
                      "border-accent/30 bg-accent/10 text-accent",
                    ev.recommendation === "Recommended" &&
                      "border-secondary/30 bg-secondary/10 text-secondary",
                    ev.recommendation === "Needs Review" &&
                      "border-warning/30 bg-warning/10 text-warning",
                    ev.recommendation === "Not Recommended" &&
                      "border-danger/30 bg-danger/10 text-danger"
                  )}
                >
                  {ev.recommendation}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <ScorePill label="Technical" value={ev.technical} />
                <ScorePill label="Communication" value={ev.communication} />
                <ScorePill label="Culture" value={ev.cultureFit} />
                <ScorePill
                  label="Confidence"
                  value={Math.round(ev.confidence * 100)}
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-medium text-accent">Strengths</p>
                  <ul className="space-y-1 text-sm text-subtext">
                    {ev.strengths.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-warning">Weaknesses</p>
                  <ul className="space-y-1 text-sm text-subtext">
                    {ev.weaknesses.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {evals.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Candidate Comparison</CardTitle>
            <CardDescription>Side-by-side evaluation snapshot</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-subtext">
                <tr>
                  <th className="pb-2 font-medium">Candidate</th>
                  <th className="pb-2 font-medium">Tech</th>
                  <th className="pb-2 font-medium">Comm</th>
                  <th className="pb-2 font-medium">Culture</th>
                  <th className="pb-2 font-medium">Rec</th>
                </tr>
              </thead>
              <tbody>
                {evals.slice(0, 4).map((ev) => (
                  <tr key={ev.id} className="border-t border-white/5">
                    <td className="py-2.5">{ev.candidateName}</td>
                    <td>{ev.technical}</td>
                    <td>{ev.communication}</td>
                    <td>{ev.cultureFit}</td>
                    <td className="text-subtext">{ev.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
