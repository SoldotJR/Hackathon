/**
 * Analytics & dashboard stats — backend with mock fallback.
 */
import type { AnalyticsData, ApiResponse, DashboardStats } from "@/types";
import { delay } from "@/utils/format";
import { MOCK_ANALYTICS, MOCK_DASHBOARD_STATS } from "./mock-data";
import { apiFetch } from "./api";

export async function getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
  try {
    const res = await apiFetch<ApiResponse<AnalyticsData>>("/api/analytics");
    if (res.success && res.data?.candidateDistribution?.length) return res;
  } catch {
    /* fallback */
  }
  await delay(400);
  return { success: true, data: MOCK_ANALYTICS };
}

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  try {
    const res = await apiFetch<ApiResponse<DashboardStats>>("/api/stats");
    if (res.success && res.data) return res;
  } catch {
    /* fallback */
  }
  await delay(250);
  return { success: true, data: MOCK_DASHBOARD_STATS };
}
