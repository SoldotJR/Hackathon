"use client";

import { useEffect, useState } from "react";
import type { Candidate } from "@/types";
import { getCandidates } from "@/services/candidates";
import { CandidateCard } from "@/features/candidates/CandidateCard";
import { CandidateTable } from "@/features/candidates/CandidateTable";
import { CandidateDetailsModal } from "@/features/candidates/CandidateDetailsModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    getCandidates().then((res) => {
      if (res.success) setCandidates(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
            Candidates
          </h1>
          <p className="mt-1 text-subtext">
            Ranked talent pool from the latest recruitment plan
          </p>
        </div>
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
          {candidates.map((c, i) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              index={i}
              onViewDetails={setSelected}
            />
          ))}
        </div>
      ) : (
        <CandidateTable
          candidates={candidates}
          onViewDetails={setSelected}
        />
      )}

      <CandidateDetailsModal
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
