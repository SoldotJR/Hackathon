/**
 * Candidates API — backend with mock fallback.
 */
import type { ApiResponse, Candidate } from "@/types";
import { delay } from "@/utils/format";
import { MOCK_CANDIDATES } from "./mock-data";
import { apiFetch } from "./api";

export async function getCandidates(): Promise<ApiResponse<Candidate[]>> {
  try {
    const res = await apiFetch<ApiResponse<Candidate[]>>("/api/candidates");
    if (res.success && res.data?.length) return res;
  } catch {
    /* fallback */
  }
  await delay(350);
  return {
    success: true,
    data: [...MOCK_CANDIDATES].sort((a, b) => b.matchScore - a.matchScore),
  };
}

export async function getCandidateById(
  id: string
): Promise<ApiResponse<Candidate | null>> {
  try {
    return await apiFetch<ApiResponse<Candidate | null>>(
      `/api/candidates/${id}`
    );
  } catch {
    await delay(250);
    const candidate = MOCK_CANDIDATES.find((c) => c.id === id) ?? null;
    return {
      success: !!candidate,
      data: candidate,
      message: candidate ? undefined : "Candidate not found",
    };
  }
}

export async function getTopCandidates(
  limit = 5
): Promise<ApiResponse<Candidate[]>> {
  const all = await getCandidates();
  return {
    success: true,
    data: all.data.slice(0, limit),
  };
}
