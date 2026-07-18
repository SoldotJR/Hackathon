from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

RecommendationLevel = Literal["Highly Recommended", "Recommended", "Needs Review"]
AgentStatus = Literal["pending", "running", "completed", "error"]
AgentId = Literal[
    "master",
    "requirement",
    "resume-parser",
    "matching",
    "skill-gap",
    "ranking",
    "interview-generator",
    "salary-analysis",
    "schedule",
    "hiring-report",
]


class Skill(BaseModel):
    name: str
    level: int = Field(ge=0, le=100)


class Project(BaseModel):
    name: str
    description: str
    tech: list[str] = []
    url: str | None = None


class Education(BaseModel):
    degree: str
    institution: str
    year: str


class Certificate(BaseModel):
    name: str
    issuer: str
    year: str


class Candidate(BaseModel):
    id: str
    name: str
    photo: str
    title: str
    experience: float
    experienceLabel: str
    skills: list[Skill]
    education: list[Education] = []
    certificates: list[Certificate] = []
    projects: list[Project] = []
    salary: int
    matchScore: int
    portfolio: str = ""
    linkedin: str = ""
    github: str = ""
    recommendation: RecommendationLevel
    resumeSummary: str
    location: str = ""


class RecruitmentSummary(BaseModel):
    position: str
    candidates: int
    topMatches: int
    averageMatch: float
    budget: int


class SkillGapData(BaseModel):
    labels: list[str]
    required: list[int]
    current: list[int]
    missing: list[str]


class InterviewQuestion(BaseModel):
    id: str
    category: Literal["Technical", "Behavioral", "Culture Fit", "Communication"]
    question: str
    difficulty: Literal["Easy", "Medium", "Hard"]


class SalaryAnalysis(BaseModel):
    companyBudget: int
    candidateExpectation: int
    difference: int
    compatibility: int
    candidateId: str
    candidateName: str


class InterviewSlot(BaseModel):
    id: str
    day: str
    date: str
    time: str
    candidateId: str
    candidateName: str
    type: str
    duration: str


class HiringRecommendation(BaseModel):
    candidateId: str
    candidateName: str
    level: RecommendationLevel
    reasoning: str
    pros: list[str]
    cons: list[str]
    riskLevel: Literal["Low", "Medium", "High"]


class WorkflowAgent(BaseModel):
    id: AgentId
    label: str
    description: str
    status: AgentStatus = "pending"
    progress: int = 0


class HiringRequirements(BaseModel):
    position: str = "Software Engineer"
    headcount: int = 1
    skills: list[str] = []
    budget: int = 1500
    experience_min: float = 0
    experience_max: float = 5
    english_required: bool = True
    seniority: str = "Junior"
    location: str | None = None
    notes: str = ""


class RecruitmentPlan(BaseModel):
    id: str
    request: str
    createdAt: str
    summary: RecruitmentSummary
    candidates: list[Candidate]
    skillGap: SkillGapData
    interviewQuestions: list[InterviewQuestion]
    salaryAnalyses: list[SalaryAnalysis]
    schedule: list[InterviewSlot]
    recommendations: list[HiringRecommendation]
    agents: list[WorkflowAgent]
    requirements: HiringRequirements | None = None
    processingTimeMs: int = 0
    confidenceScore: float = 0.0
    explainability: dict[str, Any] = Field(default_factory=dict)


class AnalyticsData(BaseModel):
    candidateDistribution: list[dict[str, Any]]
    skillMatch: list[dict[str, Any]]
    experienceDistribution: list[dict[str, Any]]
    salaryDistribution: list[dict[str, Any]]
    recruitmentTimeline: list[dict[str, Any]]


class DashboardStats(BaseModel):
    activeRequests: int
    totalCandidates: int
    interviewsScheduled: int
    avgMatchScore: float
    hireRate: float
    timeToHire: float


class GeneratePlanPayload(BaseModel):
    request: str = Field(min_length=20)
    resume_ids: list[str] = Field(default_factory=list)


class ApiResponse(BaseModel):
    data: Any
    success: bool = True
    message: str | None = None


class UploadResumeResponse(BaseModel):
    id: str
    filename: str
    textPreview: str
    pages: int
    parsed: dict[str, Any] | None = None
