import type { Candidate, RecruitmentSnapshot } from '../types/recruitment'
import { mockCandidates, mockPipeline, mockRoleDemand } from './mock/candidates'

const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getRecruitmentSnapshot(): Promise<RecruitmentSnapshot> {
  await delay()
  const active = mockCandidates.filter((c) => c.status !== 'rejected')
  const averageMatch = Math.round(
    active.reduce((sum, c) => sum + c.matchScore, 0) / Math.max(active.length, 1),
  )

  return {
    candidates: mockCandidates,
    pipeline: mockPipeline,
    roleDemand: mockRoleDemand,
    screenedToday: 11,
    averageMatch,
  }
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await delay(160)
  return mockCandidates.find((c) => c.id === id) ?? null
}

export async function advanceCandidate(id: string): Promise<Candidate | null> {
  await delay(200)
  const candidate = mockCandidates.find((c) => c.id === id)
  if (!candidate) return null

  const order = ['new', 'screening', 'interview', 'offer', 'hired'] as const
  const idx = order.indexOf(candidate.status as (typeof order)[number])
  if (idx >= 0 && idx < order.length - 1) {
    candidate.status = order[idx + 1]
  }
  return { ...candidate }
}
