export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'

export interface SkillScore {
  skill: string
  score: number
}

export interface Candidate {
  id: string
  name: string
  role: string
  location: string
  experienceYears: number
  matchScore: number
  status: CandidateStatus
  skills: SkillScore[]
  summary: string
  appliedAt: string
}

export interface PipelineStage {
  stage: string
  count: number
}

export interface RoleDemand {
  role: string
  openings: number
  applicants: number
}

export interface RecruitmentSnapshot {
  candidates: Candidate[]
  pipeline: PipelineStage[]
  roleDemand: RoleDemand[]
  screenedToday: number
  averageMatch: number
}
