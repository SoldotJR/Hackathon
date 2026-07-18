"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import type { InterviewQuestion } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

const categoryColor: Record<InterviewQuestion["category"], string> = {
  Technical: "border-primary/30 bg-primary/10 text-primary",
  Behavioral: "border-secondary/30 bg-secondary/10 text-secondary",
  "Culture Fit": "border-accent/30 bg-accent/10 text-accent",
  Communication: "border-warning/30 bg-warning/10 text-warning",
};

interface InterviewCardProps {
  question: InterviewQuestion;
  index?: number;
}

export function InterviewCard({ question, index = 0 }: InterviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="h-full">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge className={categoryColor[question.category]}>
            {question.category}
          </Badge>
          <Badge className="border-white/10 bg-white/5 text-subtext">
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-xl bg-white/5 p-2 text-subtext">
            <MessageSquare className="h-4 w-4" />
          </div>
          <p className="text-sm leading-relaxed text-white/90">
            {question.question}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

interface InterviewQuestionsGridProps {
  questions: InterviewQuestion[];
}

export function InterviewQuestionsGrid({
  questions,
}: InterviewQuestionsGridProps) {
  const categories: InterviewQuestion["category"][] = [
    "Technical",
    "Behavioral",
    "Culture Fit",
    "Communication",
  ];

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const items = questions.filter((q) => q.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <h3
              className={cn(
                "mb-4 font-[family-name:var(--font-syne)] text-lg font-semibold"
              )}
            >
              {cat} Questions
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((q, i) => (
                <InterviewCard key={q.id} question={q} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
