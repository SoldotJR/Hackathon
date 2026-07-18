import type { Candidate, RecruitmentSnapshot } from '../types/recruitment'

export type RecruitmentState = {
  snapshot: RecruitmentSnapshot | null
  selectedId: string | null
  loading: boolean
  error: string | null
}

export function selectCandidate(
  candidates: Candidate[],
  id: string | null,
): Candidate | null {
  if (!id) return candidates[0] ?? null
  return candidates.find((c) => c.id === id) ?? candidates[0] ?? null
}
