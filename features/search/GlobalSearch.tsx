"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Briefcase, Calendar, FileText, Mail, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCandidates } from "@/services/candidates";
import type { Candidate } from "@/types";
import { cn } from "@/utils/cn";

type SearchHit = {
  id: string;
  label: string;
  meta: string;
  href: string;
  kind: "candidate" | "job" | "interview" | "report" | "email" | "recruiter";
};

const STATIC_HITS: SearchHit[] = [
  {
    id: "job-1",
    label: "Junior Frontend Developer",
    meta: "Job · Active requisition",
    href: "/dashboard/recruitment?tab=overview",
    kind: "job",
  },
  {
    id: "int-1",
    label: "Interview · Emily Johnson",
    meta: "Interview · Tomorrow 10:00",
    href: "/dashboard/recruitment?tab=interview",
    kind: "interview",
  },
  {
    id: "int-2",
    label: "Interview · Marcus Chen",
    meta: "Interview · Today 14:30",
    href: "/dashboard/recruitment?tab=interview",
    kind: "interview",
  },
  {
    id: "rep-1",
    label: "Hiring Summary",
    meta: "Report · Export Center",
    href: "/dashboard/reports",
    kind: "report",
  },
  {
    id: "rep-2",
    label: "Analytics Dashboard",
    meta: "Report · KPIs & charts",
    href: "/dashboard/reports",
    kind: "report",
  },
  {
    id: "em-1",
    label: "Interview invitation emails",
    meta: "Email · Automation",
    href: "/dashboard/automation?tab=communication",
    kind: "email",
  },
  {
    id: "rec-1",
    label: "Alex Rivera",
    meta: "Recruiter · Senior Recruiter",
    href: "/dashboard/settings",
    kind: "recruiter",
  },
];

const KIND_ICON = {
  candidate: User,
  job: Briefcase,
  interview: Calendar,
  report: FileText,
  email: Mail,
  recruiter: Users,
};

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCandidates().then((r) => r.success && setCandidates(r.data));
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const candHits: SearchHit[] = candidates
      .filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.title.toLowerCase().includes(term) ||
          c.skills.some((s) => s.name.toLowerCase().includes(term))
      )
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        label: c.name,
        meta: `Candidate · ${c.title} · ${c.matchScore}%`,
        href: "/dashboard/candidates",
        kind: "candidate" as const,
      }));
    const staticHits = STATIC_HITS.filter(
      (h) =>
        h.label.toLowerCase().includes(term) ||
        h.meta.toLowerCase().includes(term) ||
        h.kind.includes(term)
    );
    return [...candHits, ...staticHits].slice(0, 8);
  }, [q, candidates]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext" />
      <Input
        placeholder="Search candidates, jobs, interviews…"
        className="h-10 pl-9"
        aria-label="Global search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-subtext">No results</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((hit) => {
                const Icon = KIND_ICON[hit.kind];
                return (
                  <li key={hit.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5"
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                        router.push(hit.href);
                      }}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{hit.label}</span>
                        <span className="block truncate text-xs text-subtext">{hit.meta}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
