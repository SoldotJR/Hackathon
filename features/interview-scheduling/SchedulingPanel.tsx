"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmSchedule, getSchedules } from "@/services/automation";
import type { ScheduleSuggestion } from "@/types/automation";

export function SchedulingPanel() {
  const [slots, setSlots] = useState<ScheduleSuggestion[]>([]);
  const [confirmed, setConfirmed] = useState<ScheduleSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedules().then((res) => {
      if (res.success) {
        setSlots(res.data);
        const done = res.data.find((s) => s.confirmed);
        if (done) setConfirmed(done);
      }
      setLoading(false);
    });
  }, []);

  const onConfirm = async (id: string) => {
    const res = await confirmSchedule(id);
    if (res.success) {
      setConfirmed(res.data);
      setSlots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, confirmed: true } : s))
      );
    }
  };

  if (loading) return <Skeleton className="h-80 rounded-[24px]" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary/20 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{s.candidateName}</p>
                    <p className="text-sm text-subtext">
                      {s.slot.day} · {s.slot.date}
                    </p>
                  </div>
                </div>
                {s.confirmed && (
                  <Badge className="border-accent/30 bg-accent/10 text-accent">
                    Confirmed
                  </Badge>
                )}
              </div>
              <dl className="space-y-1.5 text-sm text-subtext">
                <div className="flex justify-between">
                  <dt>Time</dt>
                  <dd className="text-text">{s.slot.time}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Duration</dt>
                  <dd className="text-text">{s.slot.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Timezone</dt>
                  <dd className="text-text">{s.slot.timezone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Recruiter</dt>
                  <dd className="text-accent">Available</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Candidate</dt>
                  <dd className="text-accent">Available</dd>
                </div>
              </dl>
              <p className="mt-3 flex items-center gap-1.5 truncate text-xs text-secondary">
                <Video className="h-3.5 w-3.5" />
                {s.meetLink}
              </p>
              {!s.confirmed && (
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => onConfirm(s.id)}
                >
                  <Check className="h-4 w-4" />
                  Confirm Slot
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {confirmed && (
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>
              Interview locked with {confirmed.candidateName}
            </CardDescription>
          </CardHeader>
          <p className="text-sm leading-relaxed text-subtext">
            {confirmed.slot.day}, {confirmed.slot.date} at {confirmed.slot.time} (
            {confirmed.slot.timezone}) · {confirmed.slot.duration}
          </p>
          <p className="mt-2 text-sm text-secondary">{confirmed.meetLink}</p>
        </Card>
      )}
    </div>
  );
}
