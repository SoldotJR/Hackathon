"use client";

import Image from "next/image";
import {
  ExternalLink,
  Code2,
  GraduationCap,
  Link2,
  Award,
} from "lucide-react";
import type { Candidate } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { recommendationColor, matchScoreColor } from "@/utils/recommendation";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

interface CandidateDetailsModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

export function CandidateDetailsModal({
  candidate,
  open,
  onClose,
}: CandidateDetailsModalProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Candidate Profile">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px] bg-surface ring-1 ring-white/10">
            <Image
              src={candidate.photo}
              alt={candidate.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-semibold">
                {candidate.name}
              </h3>
              <Badge className={recommendationColor(candidate.recommendation)}>
                {candidate.recommendation}
              </Badge>
            </div>
            <p className="mt-1 text-subtext">
              {candidate.title} · {candidate.experienceLabel} ·{" "}
              {candidate.location}
            </p>
            <p
              className={cn(
                "mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold",
                matchScoreColor(candidate.matchScore)
              )}
            >
              {candidate.matchScore}% match
            </p>
          </div>
        </div>

        <section>
          <h4 className="mb-2 text-sm font-medium text-subtext">
            Resume Summary
          </h4>
          <p className="text-sm leading-relaxed text-white/90">
            {candidate.resumeSummary}
          </p>
        </section>

        <section>
          <h4 className="mb-3 text-sm font-medium text-subtext">Skills</h4>
          <div className="space-y-3">
            {candidate.skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="text-subtext">{skill.level}%</span>
                </div>
                <Progress value={skill.level} />
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl bg-surface/50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-subtext">
              <GraduationCap className="h-4 w-4" /> Education
            </h4>
            {candidate.education.map((ed) => (
              <div key={ed.institution} className="mb-2 last:mb-0">
                <p className="font-medium">{ed.degree}</p>
                <p className="text-sm text-subtext">
                  {ed.institution} · {ed.year}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl bg-surface/50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-subtext">
              <Award className="h-4 w-4" /> Certificates
            </h4>
            {candidate.certificates.length === 0 ? (
              <p className="text-sm text-subtext">None listed</p>
            ) : (
              candidate.certificates.map((cert) => (
                <div key={cert.name} className="mb-2 last:mb-0">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-subtext">
                    {cert.issuer} · {cert.year}
                  </p>
                </div>
              ))
            )}
          </section>
        </div>

        <section>
          <h4 className="mb-3 text-sm font-medium text-subtext">Projects</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {candidate.projects.map((project) => (
              <div
                key={project.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-medium">{project.name}</p>
                <p className="mt-1 text-sm text-subtext">
                  {project.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      className="border-white/10 bg-white/5 text-xs text-subtext"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
          <p className="text-sm text-subtext">
            Expected:{" "}
            <span className="font-medium text-white">
              {formatCurrency(candidate.salary)}/mo
            </span>
          </p>
          <div className="ml-auto flex gap-2">
            <a
              href={candidate.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-subtext transition hover:text-white"
            >
              <ExternalLink className="h-4 w-4" /> Portfolio
            </a>
            <a
              href={candidate.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-subtext transition hover:text-white"
            >
              <Code2 className="h-4 w-4" /> GitHub
            </a>
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-subtext transition hover:text-white"
            >
              <Link2 className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
