"use client";

import Image from "next/image";
import type { Candidate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { recommendationColor, matchScoreColor } from "@/utils/recommendation";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

interface CandidateTableProps {
  candidates: Candidate[];
  onViewDetails: (candidate: Candidate) => void;
}

export function CandidateTable({
  candidates,
  onViewDetails,
}: CandidateTableProps) {
  return (
    <div className="glass overflow-hidden rounded-[24px]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-subtext">
              <th className="px-5 py-4 font-medium">Candidate</th>
              <th className="px-5 py-4 font-medium">Experience</th>
              <th className="px-5 py-4 font-medium">Skills</th>
              <th className="px-5 py-4 font-medium">Salary</th>
              <th className="px-5 py-4 font-medium">Match</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-surface">
                      <Image
                        src={c.photo}
                        alt={c.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-subtext">{c.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-subtext">{c.experienceLabel}</td>
                <td className="px-5 py-4">
                  <div className="flex max-w-[200px] flex-wrap gap-1">
                    {c.skills.slice(0, 3).map((s) => (
                      <Badge
                        key={s.name}
                        className="border-white/10 bg-white/5 text-xs text-subtext"
                      >
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 tabular-nums">
                  {formatCurrency(c.salary)}
                </td>
                <td className="px-5 py-4">
                  <div className="w-28">
                    <p
                      className={cn(
                        "mb-1 text-sm font-semibold",
                        matchScoreColor(c.matchScore)
                      )}
                    >
                      {c.matchScore}%
                    </p>
                    <Progress value={c.matchScore} className="h-1.5" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge className={recommendationColor(c.recommendation)}>
                    {c.recommendation}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDetails(c)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
