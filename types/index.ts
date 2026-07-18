/** Shared domain types for TalentPilot AI — backend-ready contracts */

export type RecommendationLevel =
  | "Highly Recommended"
  | "Recommended"
  | "Needs Review";

export type AgentStatus = "pending" | "running" | "completed" | "error";

export type AgentId =
  | "master"
  | "requirement"
  | "resume-parser"
  | "matching"
  | "skill-gap"
  | "ranking"
  | "interview-generator"
  | "salary-analysis"
  | "schedule"
  | "hiring-report";

export interface Skill {
  name: string;
  level: number; // 0–100
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface Candidate {
  id: string;
  name: string;
  photo: string;
  title: string;
  experience: number;
  experienceLabel: string;
  skills: Skill[];
  education: Education[];
  certificates: Certificate[];
  projects: Project[];
  salary: number;
  matchScore: number;
  portfolio: string;
  linkedin: string;
  github: string;
  recommendation: RecommendationLevel;
  resumeSummary: string;
  location: string;
}

export interface RecruitmentSummary {
  position: string;
  candidates: number;
  topMatches: number;
  averageMatch: number;
  budget: number;
}

export interface SkillGapData {
  labels: string[];
  required: number[];
  current: number[];
  missing: string[];
}

export interface InterviewQuestion {
  id: string;
  category: "Technical" | "Behavioral" | "Culture Fit" | "Communication";
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SalaryAnalysis {
  companyBudget: number;
  candidateExpectation: number;
  difference: number;
  compatibility: number;
  candidateId: string;
  candidateName: string;
}

export interface InterviewSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  candidateId: string;
  candidateName: string;
  type: string;
  duration: string;
}

export interface HiringRecommendation {
  candidateId: string;
  candidateName: string;
  level: RecommendationLevel;
  reasoning: string;
  pros: string[];
  cons: string[];
  riskLevel: "Low" | "Medium" | "High";
}

export interface WorkflowAgent {
  id: AgentId;
  label: string;
  description: string;
  status: AgentStatus;
  progress: number;
}

export interface RecruitmentPlan {
  id: string;
  request: string;
  createdAt: string;
  summary: RecruitmentSummary;
  candidates: Candidate[];
  skillGap: SkillGapData;
  interviewQuestions: InterviewQuestion[];
  salaryAnalyses: SalaryAnalysis[];
  schedule: InterviewSlot[];
  recommendations: HiringRecommendation[];
  agents: WorkflowAgent[];
  processingTimeMs?: number;
  confidenceScore?: number;
  explainability?: Record<string, unknown>;
}

export interface AnalyticsData {
  candidateDistribution: { name: string; value: number }[];
  skillMatch: { skill: string; score: number }[];
  experienceDistribution: { range: string; count: number }[];
  salaryDistribution: { range: string; count: number }[];
  recruitmentTimeline: { stage: string; days: number }[];
}

export interface DashboardStats {
  activeRequests: number;
  totalCandidates: number;
  interviewsScheduled: number;
  avgMatchScore: number;
  hireRate: number;
  timeToHire: number;
}

export interface GeneratePlanPayload {
  request: string;
  resume_ids?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ExplainabilityBlock {
  [key: string]: unknown;
}

/** Extended fields returned by the FastAPI backend */
export interface RecruitmentPlanMeta {
  processingTimeMs?: number;
  confidenceScore?: number;
  explainability?: ExplainabilityBlock;
}
