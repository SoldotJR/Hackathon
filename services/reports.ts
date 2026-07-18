/**
 * Reports & recommendations API (mock).
 */
import type {
  ApiResponse,
  HiringRecommendation,
  RecruitmentSummary,
  SalaryAnalysis,
  SkillGapData,
} from "@/types";
import { delay } from "@/utils/format";
import {
  MOCK_RECOMMENDATIONS,
  MOCK_SALARY_ANALYSES,
  MOCK_SKILL_GAP,
  MOCK_SUMMARY,
} from "./mock-data";

export async function getHiringRecommendations(): Promise<
  ApiResponse<HiringRecommendation[]>
> {
  await delay(300);
  return { success: true, data: MOCK_RECOMMENDATIONS };
}

export async function getSalaryAnalyses(): Promise<
  ApiResponse<SalaryAnalysis[]>
> {
  await delay(300);
  return { success: true, data: MOCK_SALARY_ANALYSES };
}

export async function getSkillGap(): Promise<ApiResponse<SkillGapData>> {
  await delay(300);
  return { success: true, data: MOCK_SKILL_GAP };
}

export async function getRecruitmentSummary(): Promise<
  ApiResponse<RecruitmentSummary>
> {
  await delay(200);
  return { success: true, data: MOCK_SUMMARY };
}
