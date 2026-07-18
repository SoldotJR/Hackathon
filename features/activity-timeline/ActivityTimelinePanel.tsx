"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTimeline } from "@/components/ui/simple-timeline";
import { getActivity } from "@/services/automation";
import type { ActivityEvent } from "@/types/automation";

export function ActivityTimelinePanel() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivity().then((res) => {
      if (res.success) setEvents(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-96 rounded-[24px]" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Every automated action in the hiring pipeline</CardDescription>
      </CardHeader>
      <SimpleTimeline
        items={events.map((e) => ({
          id: e.id,
          time: e.time,
          title: e.title,
          description: e.description,
          meta: e.agent,
          tone: e.status,
        }))}
      />
    </Card>
  );
}
