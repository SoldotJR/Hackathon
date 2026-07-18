"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search, X } from "lucide-react";
import type { Candidate } from "@/types";
import { getCandidates } from "@/services/candidates";
import { CandidateCard } from "@/features/candidates/CandidateCard";
import { CandidateTable } from "@/features/candidates/CandidateTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HubTabs } from "@/components/ui/hub-tabs";
import { Progress } from "@/components/ui/progress";
import { EmailComposer } from "@/components/ui/email-composer";
import { SimpleTimeline } from "@/components/ui/simple-timeline";
import { recommendationColor, matchScoreColor } from "@/utils/recommendation";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

const DRAWER_TABS = [
  { id: "profile", label: "Profile" },
  { id: "resume", label: "Resume" },
  { id: "communication", label: "Communication" },
  { id: "interview", label: "Interview" },
  { id: "evaluation", label: "Evaluation" },
  { id: "history", label: "History" },
];

export function CandidatesHub() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"match" | "name" | "exp">("match");
  const [filter, setFilter] = useState<"all" | "Highly Recommended" | "Recommended" | "Needs Review">("all");
  const [drawerTab, setDrawerTab] = useState("profile");

  useEffect(() => {
    getCandidates().then((res) => {
      if (res.success) setCandidates(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (filter !== "all") {
      list = list.filter((c) => c.recommendation === filter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.skills.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "exp") return b.experience - a.experience;
      return b.matchScore - a.matchScore;
    });
    return list;
  }, [candidates, query, sort, filter]);

  const openCandidate = (c: Candidate) => {
    setSelected(c);
    setDrawerTab("profile");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Candidates
        </h1>
        <p className="mt-1 text-subtext">
          Screening, ranking, communication, and evaluation — one candidate at a time
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, role, skill…"
            className="h-11 pl-9"
          />
        </div>
        <select
          className="h-11 rounded-xl border border-border bg-surface px-3 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All recommendations</option>
          <option value="Highly Recommended">Highly Recommended</option>
          <option value="Recommended">Recommended</option>
          <option value="Needs Review">Needs Review</option>
        </select>
        <select
          className="h-11 rounded-xl border border-border bg-surface px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="match">Sort by match</option>
          <option value="name">Sort by name</option>
          <option value="exp">Sort by experience</option>
        </select>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "primary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "table" ? "primary" : "ghost"}
            size="icon"
            onClick={() => setView("table")}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-[24px]" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              index={i}
              onViewDetails={openCandidate}
            />
          ))}
        </div>
      ) : (
        <CandidateTable candidates={filtered} onViewDetails={openCandidate} />
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-card shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-surface">
                    <Image
                      src={selected.photo}
                      alt={selected.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{selected.name}</h2>
                    <p className="text-xs text-subtext">{selected.title}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-b border-white/10 px-4 py-3">
                <HubTabs tabs={DRAWER_TABS} active={drawerTab} onChange={setDrawerTab} />
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {drawerTab === "profile" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={recommendationColor(selected.recommendation)}>
                        {selected.recommendation}
                      </Badge>
                      <span
                        className={cn(
                          "font-[family-name:var(--font-syne)] text-2xl font-bold",
                          matchScoreColor(selected.matchScore)
                        )}
                      >
                        {selected.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm text-subtext">{selected.resumeSummary}</p>
                    <div>
                      <p className="mb-2 text-xs text-subtext">Skills</p>
                      <div className="space-y-2">
                        {selected.skills.map((s) => (
                          <div key={s.name}>
                            <div className="mb-1 flex justify-between text-xs">
                              <span>{s.name}</span>
                              <span className="text-subtext">{s.level}%</span>
                            </div>
                            <Progress value={s.level} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">
                      Expected: {formatCurrency(selected.salary)}/mo · {selected.location}
                    </p>
                  </div>
                )}

                {drawerTab === "resume" && (
                  <div className="space-y-4 text-sm">
                    <section>
                      <h3 className="mb-2 font-medium">Education</h3>
                      {selected.education.map((e) => (
                        <p key={e.degree} className="text-subtext">
                          {e.degree} — {e.institution} ({e.year})
                        </p>
                      ))}
                    </section>
                    <section>
                      <h3 className="mb-2 font-medium">Projects</h3>
                      {selected.projects.map((p) => (
                        <div key={p.name} className="mb-2">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-subtext">{p.description}</p>
                        </div>
                      ))}
                    </section>
                    <section>
                      <h3 className="mb-2 font-medium">Certificates</h3>
                      {selected.certificates.length === 0 && (
                        <p className="text-subtext">None listed</p>
                      )}
                      {selected.certificates.map((c) => (
                        <p key={c.name} className="text-subtext">
                          {c.name} · {c.issuer} ({c.year})
                        </p>
                      ))}
                    </section>
                  </div>
                )}

                {drawerTab === "communication" && (
                  <EmailComposer
                    subject={`Update for ${selected.name}`}
                    body={`Dear ${selected.name},\n\nThank you for your interest in TalentPilot Labs.\n\nBest regards,\nTalent Acquisition`}
                    status="Pending"
                  />
                )}

                {drawerTab === "interview" && (
                  <div className="space-y-3 text-sm">
                    <p className="text-subtext">Suggested questions for this candidate:</p>
                    <ul className="space-y-2 text-subtext">
                      <li>• Walk through a React component you shipped recently.</li>
                      <li>• How do you approach TypeScript in a growing codebase?</li>
                      <li>• Tell us about a time you clarified requirements with design.</li>
                    </ul>
                  </div>
                )}

                {drawerTab === "evaluation" && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Technical", 88],
                      ["Communication", 90],
                      ["Culture", 86],
                      ["Overall", selected.matchScore],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-2xl bg-surface/50 p-3">
                        <p className="text-xs text-subtext">{label}</p>
                        <p className="mt-1 text-xl font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {drawerTab === "history" && (
                  <SimpleTimeline
                    items={[
                      {
                        id: "h1",
                        time: "09:12",
                        title: "Application received",
                        tone: "success",
                      },
                      {
                        id: "h2",
                        time: "09:18",
                        title: "Screened & ranked",
                        description: `${selected.matchScore}% match`,
                        tone: "success",
                      },
                      {
                        id: "h3",
                        time: "Pending",
                        title: "Interview decision",
                        tone: "pending",
                      },
                    ]}
                  />
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
