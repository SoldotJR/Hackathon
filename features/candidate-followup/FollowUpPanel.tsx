"use client";

import { useEffect, useState } from "react";
import { UserX, UserCheck, Hourglass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTimeline } from "@/components/ui/simple-timeline";
import { getFollowUps } from "@/services/automation";
import type { FollowUpRule } from "@/types/automation";
import { cn } from "@/utils/cn";

export function FollowUpPanel() {
  const [rules, setRules] = useState<FollowUpRule[]>([]);
  const [selected, setSelected] = useState<FollowUpRule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFollowUps().then((res) => {
      if (res.success) {
        setRules(res.data);
        setSelected(res.data[0] ?? null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-80 rounded-[24px]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {rules.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelected(r)}
            className={cn(
              "glass w-full rounded-[24px] p-4 text-left transition",
              selected?.id === r.id && "ring-1 ring-primary/40"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {r.status === "Inactive" ? (
                  <UserX className="h-4 w-4 text-danger" />
                ) : r.status === "Replied" ? (
                  <UserCheck className="h-4 w-4 text-accent" />
                ) : (
                  <Hourglass className="h-4 w-4 text-warning" />
                )}
                <span className="font-medium">{r.candidateName}</span>
              </div>
              <Badge
                className={cn(
                  r.status === "Inactive" && "border-danger/30 bg-danger/10 text-danger",
                  r.status === "Reminder Sent" && "border-warning/30 bg-warning/10 text-warning",
                  r.status === "Monitoring" && "border-secondary/30 bg-secondary/10 text-secondary",
                  r.status === "Replied" && "border-accent/30 bg-accent/10 text-accent"
                )}
              >
                {r.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-subtext">{r.stage}</p>
            <p className="mt-1 text-xs text-subtext">
              Waiting {r.daysWaiting} day(s) · {r.nextAction}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>{selected.candidateName}</CardTitle>
            <CardDescription>Automation timeline</CardDescription>
          </CardHeader>
          <SimpleTimeline
            items={selected.timeline.map((t, i) => ({
              id: `${selected.id}-${i}`,
              time: t.at,
              title: t.label,
              tone:
                t.label.toLowerCase().includes("inactive")
                  ? "error"
                  : t.label.toLowerCase().includes("reminder")
                    ? "warning"
                    : "success",
            }))}
          />
        </Card>
      )}
    </div>
  );
}
