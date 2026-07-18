import type { RecommendationLevel } from "@/types";

export function recommendationColor(level: RecommendationLevel): string {
  switch (level) {
    case "Highly Recommended":
      return "text-accent bg-accent/10 border-accent/30";
    case "Recommended":
      return "text-secondary bg-secondary/10 border-secondary/30";
    case "Needs Review":
      return "text-warning bg-warning/10 border-warning/30";
  }
}

export function matchScoreColor(score: number): string {
  if (score >= 90) return "text-accent";
  if (score >= 75) return "text-secondary";
  if (score >= 60) return "text-warning";
  return "text-danger";
}
