"use client";

import { useEffect, useState } from "react";
import { Bell, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTimeline } from "@/components/ui/simple-timeline";
import { getReminders } from "@/services/automation";
import type { InterviewReminder } from "@/types/automation";

export function ReminderPanel() {
  const [reminders, setReminders] = useState<InterviewReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReminders().then((res) => {
      if (res.success) setReminders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-80 rounded-[24px]" />;

  const upcoming = reminders.filter((r) => r.status === "Upcoming");
  const history = reminders.filter((r) => r.status !== "Upcoming");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reminders</CardTitle>
          <CardDescription>
            Auto-scheduled at 24h, 1h, and 10 minutes before interview
          </CardDescription>
        </CardHeader>
        <ul className="space-y-3">
          {upcoming.map((r) => (
            <li
              key={r.id}
              className="flex items-start gap-3 rounded-2xl bg-surface/40 px-4 py-3"
            >
              <div className="rounded-xl bg-secondary/20 p-2">
                <Bell className="h-4 w-4 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.candidateName}</p>
                <p className="text-sm text-subtext">
                  {r.offsetLabel} before · {r.channel}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-subtext">
                  <Clock className="h-3 w-3" />
                  Interview {new Date(r.interviewAt).toLocaleString()}
                </p>
              </div>
              <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                {r.status}
              </Badge>
            </li>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-subtext">No upcoming reminders</p>
          )}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder History</CardTitle>
          <CardDescription>Delivery status timeline</CardDescription>
        </CardHeader>
        <SimpleTimeline
          items={history.map((r) => ({
            id: r.id,
            time: r.offsetLabel,
            title: r.candidateName,
            description: `${r.channel} · ${r.status}`,
            tone: r.status === "Sent" ? "success" : r.status === "Failed" ? "error" : "default",
          }))}
        />
        {history.length === 0 && (
          <p className="text-sm text-subtext">No history yet</p>
        )}
      </Card>
    </div>
  );
}
