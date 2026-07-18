import { getAutomationPipeline } from "@/services/automation";
import { getHiringRecommendations } from "@/services/reports";
import type { HiringRecommendation } from "@/types";

export { getAutomationPipeline };

export async function getHiringRecommendationsSafe(): Promise<
  HiringRecommendation[]
> {
  try {
    const res = await getHiringRecommendations();
    if (res.success) return res.data;
  } catch {
    /* ignore */
  }
  return [];
}
