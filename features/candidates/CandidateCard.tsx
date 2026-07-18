"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Candidate } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { recommendationColor, matchScoreColor } from "@/utils/recommendation";
import { cn } from "@/utils/cn";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  index?: number;
}

export function CandidateCard({
  candidate,
  onViewDetails,
  index = 0,
}: CandidateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4, rotateX: 2 }}
      style={{ transformPerspective: 800 }}
    >
      <Card className="h-full">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-surface ring-1 ring-white/10">
            <Image
              src={candidate.photo}
              alt={candidate.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="truncate font-semibold">{candidate.name}</h3>
                <p className="text-sm text-subtext">
                  {candidate.experienceLabel} · {candidate.title}
                </p>
              </div>
              <span
                className={cn(
                  "font-[family-name:var(--font-syne)] text-2xl font-bold",
                  matchScoreColor(candidate.matchScore)
                )}
              >
                {candidate.matchScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-subtext">
            <span>Overall Match</span>
            <span>{candidate.matchScore}%</span>
          </div>
          <Progress value={candidate.matchScore} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {candidate.skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill.name}
              className="border-white/10 bg-white/5 text-subtext"
            >
              {skill.name}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Badge className={recommendationColor(candidate.recommendation)}>
            {candidate.recommendation}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(candidate)}
          >
            View Details
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
