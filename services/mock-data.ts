import type {
  AnalyticsData,
  Candidate,
  DashboardStats,
  HiringRecommendation,
  InterviewQuestion,
  InterviewSlot,
  RecruitmentPlan,
  RecruitmentSummary,
  SalaryAnalysis,
  SkillGapData,
  WorkflowAgent,
} from "@/types";

/** 10 mock candidates — replace via services when backend is ready */
export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Emily Johnson",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
    title: "Junior Frontend Developer",
    experience: 2,
    experienceLabel: "2 years",
    skills: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS", level: 94 },
      { name: "Next.js", level: 88 },
      { name: "JavaScript", level: 96 },
      { name: "Git", level: 90 },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Washington",
        year: "2023",
      },
    ],
    certificates: [
      { name: "Meta Front-End Developer", issuer: "Coursera", year: "2024" },
      { name: "TypeScript Professional", issuer: "Udemy", year: "2024" },
    ],
    projects: [
      {
        name: "Pulse Dashboard",
        description: "Real-time analytics dashboard with React and Recharts.",
        tech: ["React", "TypeScript", "Tailwind"],
        url: "https://github.com/emilyj/pulse",
      },
      {
        name: "ShopLite",
        description: "Headless e-commerce storefront with Next.js.",
        tech: ["Next.js", "Stripe", "Tailwind"],
      },
    ],
    salary: 1400,
    matchScore: 96,
    portfolio: "https://emilyjohnson.dev",
    linkedin: "https://linkedin.com/in/emilyjohnson",
    github: "https://github.com/emilyj",
    recommendation: "Highly Recommended",
    resumeSummary:
      "Strong junior frontend engineer with polished React/TypeScript delivery, excellent English communication, and production Tailwind experience. Ideal budget fit.",
    location: "Seattle, WA",
  },
  {
    id: "c2",
    name: "Marcus Chen",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
    title: "Frontend Developer",
    experience: 3,
    experienceLabel: "3 years",
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Next.js", level: 82 },
      { name: "Node.js", level: 70 },
      { name: "Testing", level: 78 },
    ],
    education: [
      {
        degree: "B.Eng Software Engineering",
        institution: "Georgia Tech",
        year: "2022",
      },
    ],
    certificates: [
      { name: "AWS Cloud Practitioner", issuer: "Amazon", year: "2023" },
    ],
    projects: [
      {
        name: "Kanban Flow",
        description: "Drag-and-drop project board with optimistic UI.",
        tech: ["React", "DnD Kit", "Zustand"],
      },
    ],
    salary: 1550,
    matchScore: 91,
    portfolio: "https://marcuschen.dev",
    linkedin: "https://linkedin.com/in/marcuschen",
    github: "https://github.com/mchen",
    recommendation: "Highly Recommended",
    resumeSummary:
      "Solid React foundation with strong component architecture. Slightly above budget but exceptional match on core stack.",
    location: "Austin, TX",
  },
  {
    id: "c3",
    name: "Sofia Alvarez",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia",
    title: "Junior UI Engineer",
    experience: 1.5,
    experienceLabel: "1.5 years",
    skills: [
      { name: "React", level: 86 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Figma", level: 88 },
      { name: "Accessibility", level: 84 },
      { name: "CSS", level: 95 },
    ],
    education: [
      {
        degree: "B.A. Interactive Media",
        institution: "RISD",
        year: "2024",
      },
    ],
    certificates: [
      { name: "Google UX Design", issuer: "Google", year: "2024" },
    ],
    projects: [
      {
        name: "A11y Kit",
        description: "Accessible component library built with Tailwind.",
        tech: ["React", "Tailwind", "Storybook"],
      },
    ],
    salary: 1250,
    matchScore: 89,
    portfolio: "https://sofiaalvarez.design",
    linkedin: "https://linkedin.com/in/sofiaalvarez",
    github: "https://github.com/sofiaalv",
    recommendation: "Recommended",
    resumeSummary:
      "Design-fluent frontend talent with excellent Tailwind craft and accessibility instincts. Growing TypeScript depth.",
    location: "Remote — LATAM",
  },
  {
    id: "c4",
    name: "James Okonkwo",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
    title: "Frontend Developer",
    experience: 2.5,
    experienceLabel: "2.5 years",
    skills: [
      { name: "React", level: 88 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 75 },
      { name: "Next.js", level: 86 },
      { name: "GraphQL", level: 72 },
      { name: "English", level: 98 },
    ],
    education: [
      {
        degree: "B.Sc Information Systems",
        institution: "University of Lagos",
        year: "2021",
      },
    ],
    certificates: [
      { name: "Next.js App Router", issuer: "Vercel", year: "2024" },
    ],
    projects: [
      {
        name: "PayLink",
        description: "Fintech dashboard with typed GraphQL client.",
        tech: ["Next.js", "TypeScript", "GraphQL"],
      },
    ],
    salary: 1350,
    matchScore: 88,
    portfolio: "https://jamesok.dev",
    linkedin: "https://linkedin.com/in/jamesokonkwo",
    github: "https://github.com/jamesok",
    recommendation: "Recommended",
    resumeSummary:
      "Strong TypeScript/Next.js profile with fluent English. Tailwind exposure is solid but not as deep as peers.",
    location: "Lagos / Remote",
  },
  {
    id: "c5",
    name: "Priya Sharma",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
    title: "Junior Frontend Developer",
    experience: 2,
    experienceLabel: "2 years",
    skills: [
      { name: "React", level: 87 },
      { name: "TypeScript", level: 84 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Jest", level: 80 },
      { name: "Redux", level: 78 },
      { name: "English", level: 92 },
    ],
    education: [
      {
        degree: "B.Tech CSE",
        institution: "IIT Hyderabad",
        year: "2023",
      },
    ],
    certificates: [
      { name: "React Testing Library", issuer: "Frontend Masters", year: "2024" },
    ],
    projects: [
      {
        name: "EduTrack",
        description: "Learning progress tracker with Redux Toolkit.",
        tech: ["React", "Redux", "Tailwind"],
      },
    ],
    salary: 1300,
    matchScore: 87,
    portfolio: "https://priyasharma.dev",
    linkedin: "https://linkedin.com/in/priyasharma",
    github: "https://github.com/priyas",
    recommendation: "Recommended",
    resumeSummary:
      "Reliable junior engineer with strong testing habits and clean Tailwind UI. Excellent cultural fit signals.",
    location: "Bangalore, IN",
  },
  {
    id: "c6",
    name: "Liam O'Brien",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Liam",
    title: "Frontend Developer",
    experience: 4,
    experienceLabel: "4 years",
    skills: [
      { name: "React", level: 93 },
      { name: "TypeScript", level: 91 },
      { name: "Tailwind CSS", level: 70 },
      { name: "Vue", level: 85 },
      { name: "CSS-in-JS", level: 88 },
      { name: "Performance", level: 90 },
    ],
    education: [
      {
        degree: "B.Sc Computer Science",
        institution: "Trinity College Dublin",
        year: "2020",
      },
    ],
    certificates: [],
    projects: [
      {
        name: "PerfMeter",
        description: "Web Vitals monitoring SDK for SPAs.",
        tech: ["TypeScript", "React"],
      },
    ],
    salary: 1800,
    matchScore: 78,
    portfolio: "https://liamobrien.dev",
    linkedin: "https://linkedin.com/in/liamobrien",
    github: "https://github.com/lobrien",
    recommendation: "Needs Review",
    resumeSummary:
      "Senior-leaning frontend skill set but over budget. Tailwind depth is secondary to CSS-in-JS background.",
    location: "Dublin, IE",
  },
  {
    id: "c7",
    name: "Aisha Rahman",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha",
    title: "Junior Frontend Developer",
    experience: 1,
    experienceLabel: "1 year",
    skills: [
      { name: "React", level: 78 },
      { name: "TypeScript", level: 72 },
      { name: "Tailwind CSS", level: 85 },
      { name: "HTML/CSS", level: 92 },
      { name: "English", level: 88 },
      { name: "Git", level: 80 },
    ],
    education: [
      {
        degree: "B.S. Software Engineering",
        institution: "NUS",
        year: "2025",
      },
    ],
    certificates: [
      { name: "Responsive Web Design", issuer: "freeCodeCamp", year: "2024" },
    ],
    projects: [
      {
        name: "Campus Hub",
        description: "Student portal UI with Tailwind components.",
        tech: ["React", "Tailwind"],
      },
    ],
    salary: 1100,
    matchScore: 74,
    portfolio: "https://aisharahman.dev",
    linkedin: "https://linkedin.com/in/aisharahman",
    github: "https://github.com/aishar",
    recommendation: "Needs Review",
    resumeSummary:
      "Promising early-career talent under budget. Needs mentoring on TypeScript patterns and production React.",
    location: "Singapore",
  },
  {
    id: "c8",
    name: "Noah Williams",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Noah",
    title: "Frontend Developer",
    experience: 2,
    experienceLabel: "2 years",
    skills: [
      { name: "React", level: 84 },
      { name: "TypeScript", level: 86 },
      { name: "Tailwind CSS", level: 82 },
      { name: "Next.js", level: 80 },
      { name: "Storybook", level: 85 },
      { name: "English", level: 95 },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Michigan",
        year: "2023",
      },
    ],
    certificates: [
      { name: "Storybook Essentials", issuer: "Chromatic", year: "2024" },
    ],
    projects: [
      {
        name: "Design Tokens CLI",
        description: "Token pipeline for multi-brand design systems.",
        tech: ["TypeScript", "React", "Storybook"],
      },
    ],
    salary: 1450,
    matchScore: 90,
    portfolio: "https://noahwilliams.dev",
    linkedin: "https://linkedin.com/in/noahwilliams",
    github: "https://github.com/nwilliams",
    recommendation: "Highly Recommended",
    resumeSummary:
      "Design-system minded engineer with strong English and solid stack alignment. Within budget.",
    location: "Chicago, IL",
  },
  {
    id: "c9",
    name: "Hana Kim",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hana",
    title: "Junior Frontend Developer",
    experience: 2,
    experienceLabel: "2 years",
    skills: [
      { name: "React", level: 89 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind CSS", level: 91 },
      { name: "Animation", level: 86 },
      { name: "Three.js", level: 65 },
      { name: "English", level: 90 },
    ],
    education: [
      {
        degree: "B.F.A. Digital Media",
        institution: "KAIST",
        year: "2023",
      },
    ],
    certificates: [],
    projects: [
      {
        name: "Motion Lab",
        description: "Framer Motion showcase with Tailwind themes.",
        tech: ["React", "Framer Motion", "Tailwind"],
      },
    ],
    salary: 1380,
    matchScore: 92,
    portfolio: "https://hanakim.studio",
    linkedin: "https://linkedin.com/in/hanakim",
    github: "https://github.com/hanak",
    recommendation: "Highly Recommended",
    resumeSummary:
      "Creative frontend developer with excellent motion craft and core stack mastery. Clear English communicator.",
    location: "Seoul / Remote",
  },
  {
    id: "c10",
    name: "Daniel Rossi",
    photo: "https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel",
    title: "Frontend Developer",
    experience: 3,
    experienceLabel: "3 years",
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 82 },
      { name: "Tailwind CSS", level: 78 },
      { name: "Angular", level: 80 },
      { name: "RxJS", level: 75 },
      { name: "English", level: 86 },
    ],
    education: [
      {
        degree: "Laurea Informatica",
        institution: "Politecnico di Milano",
        year: "2021",
      },
    ],
    certificates: [
      { name: "Angular Intermediate", issuer: "Google", year: "2022" },
    ],
    projects: [
      {
        name: "Fleet Ops",
        description: "Operations console migrated from Angular to React.",
        tech: ["React", "TypeScript"],
      },
    ],
    salary: 1600,
    matchScore: 72,
    portfolio: "https://danielrossi.dev",
    linkedin: "https://linkedin.com/in/danielrossi",
    github: "https://github.com/drossi",
    recommendation: "Needs Review",
    resumeSummary:
      "Capable engineer with mixed Angular/React background. Slightly over budget; Tailwind less practiced.",
    location: "Milan, IT",
  },
];

export const MOCK_SUMMARY: RecruitmentSummary = {
  position: "Frontend Developer",
  candidates: 126,
  topMatches: 5,
  averageMatch: 91,
  budget: 1500,
};

export const MOCK_SKILL_GAP: SkillGapData = {
  labels: ["React", "TypeScript", "Tailwind", "Next.js", "English", "Testing"],
  required: [90, 85, 85, 75, 90, 70],
  current: [88, 84, 86, 78, 91, 72],
  missing: ["Advanced Next.js App Router", "E2E Testing (Playwright)"],
};

export const MOCK_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "iq1",
    category: "Technical",
    question:
      "How would you structure a reusable React component library with TypeScript and Tailwind?",
    difficulty: "Medium",
  },
  {
    id: "iq2",
    category: "Technical",
    question:
      "Explain the difference between server and client components in Next.js App Router.",
    difficulty: "Hard",
  },
  {
    id: "iq3",
    category: "Technical",
    question: "How do you optimize re-renders in a data-heavy dashboard?",
    difficulty: "Medium",
  },
  {
    id: "iq4",
    category: "Behavioral",
    question:
      "Tell us about a time you received critical feedback on UI quality. What did you change?",
    difficulty: "Easy",
  },
  {
    id: "iq5",
    category: "Behavioral",
    question:
      "Describe a deadline crunch where you had to trade scope for quality.",
    difficulty: "Medium",
  },
  {
    id: "iq6",
    category: "Culture Fit",
    question:
      "How do you prefer to collaborate with designers and backend engineers?",
    difficulty: "Easy",
  },
  {
    id: "iq7",
    category: "Culture Fit",
    question: "What does ownership look like to you on a product team?",
    difficulty: "Medium",
  },
  {
    id: "iq8",
    category: "Communication",
    question:
      "Walk us through a technical decision as if explaining to a non-technical hiring manager.",
    difficulty: "Medium",
  },
  {
    id: "iq9",
    category: "Communication",
    question:
      "How would you document a frontend architecture decision for future teammates?",
    difficulty: "Easy",
  },
];

export const MOCK_SALARY_ANALYSES: SalaryAnalysis[] = [
  {
    candidateId: "c1",
    candidateName: "Emily Johnson",
    companyBudget: 1500,
    candidateExpectation: 1400,
    difference: 100,
    compatibility: 98,
  },
  {
    candidateId: "c9",
    candidateName: "Hana Kim",
    companyBudget: 1500,
    candidateExpectation: 1380,
    difference: 120,
    compatibility: 97,
  },
  {
    candidateId: "c8",
    candidateName: "Noah Williams",
    companyBudget: 1500,
    candidateExpectation: 1450,
    difference: 50,
    compatibility: 95,
  },
  {
    candidateId: "c2",
    candidateName: "Marcus Chen",
    companyBudget: 1500,
    candidateExpectation: 1550,
    difference: -50,
    compatibility: 82,
  },
  {
    candidateId: "c6",
    candidateName: "Liam O'Brien",
    companyBudget: 1500,
    candidateExpectation: 1800,
    difference: -300,
    compatibility: 55,
  },
];

export const MOCK_SCHEDULE: InterviewSlot[] = [
  {
    id: "s1",
    day: "Monday",
    date: "2026-07-20",
    time: "10:00 AM",
    candidateId: "c1",
    candidateName: "Emily Johnson",
    type: "Technical Screen",
    duration: "45 min",
  },
  {
    id: "s2",
    day: "Tuesday",
    date: "2026-07-21",
    time: "2:00 PM",
    candidateId: "c9",
    candidateName: "Hana Kim",
    type: "Technical Screen",
    duration: "45 min",
  },
  {
    id: "s3",
    day: "Wednesday",
    date: "2026-07-22",
    time: "11:30 AM",
    candidateId: "c8",
    candidateName: "Noah Williams",
    type: "Culture Fit",
    duration: "30 min",
  },
  {
    id: "s4",
    day: "Thursday",
    date: "2026-07-23",
    time: "3:30 PM",
    candidateId: "c2",
    candidateName: "Marcus Chen",
    type: "Panel Interview",
    duration: "60 min",
  },
  {
    id: "s5",
    day: "Friday",
    date: "2026-07-24",
    time: "9:00 AM",
    candidateId: "c3",
    candidateName: "Sofia Alvarez",
    type: "Technical Screen",
    duration: "45 min",
  },
];

export const MOCK_RECOMMENDATIONS: HiringRecommendation[] = [
  {
    candidateId: "c1",
    candidateName: "Emily Johnson",
    level: "Highly Recommended",
    reasoning:
      "Highest overall match with budget headroom, verified React/TypeScript/Tailwind depth, and strong English communication.",
    pros: [
      "96% match score",
      "Under budget by $100",
      "Production Next.js experience",
      "Clear communication signals",
    ],
    cons: ["Only 2 years experience", "Limited backend exposure"],
    riskLevel: "Low",
  },
  {
    candidateId: "c9",
    candidateName: "Hana Kim",
    level: "Highly Recommended",
    reasoning:
      "Excellent visual craft and motion skills that elevate product quality while staying within budget.",
    pros: [
      "92% match",
      "Strong Tailwind craft",
      "Motion/UX differentiator",
      "Budget compatible",
    ],
    cons: ["Less enterprise SaaS experience", "Three.js is secondary"],
    riskLevel: "Low",
  },
  {
    candidateId: "c6",
    candidateName: "Liam O'Brien",
    level: "Needs Review",
    reasoning:
      "High capability but exceeds junior band and monthly budget; better as stretch hire or senior track.",
    pros: ["Strong performance mindset", "Deep React experience"],
    cons: ["$300 over budget", "Overqualified for junior role", "Weaker Tailwind"],
    riskLevel: "High",
  },
];

export const MOCK_AGENTS: WorkflowAgent[] = [
  {
    id: "master",
    label: "Master Agent",
    description: "Orchestrates the recruitment pipeline",
    status: "pending",
    progress: 0,
  },
  {
    id: "requirement",
    label: "Requirement Agent",
    description: "Parses hiring request into structured criteria",
    status: "pending",
    progress: 0,
  },
  {
    id: "resume-parser",
    label: "Resume Parser",
    description: "Extracts skills and experience from resumes",
    status: "pending",
    progress: 0,
  },
  {
    id: "matching",
    label: "Matching Agent",
    description: "Scores candidates against requirements",
    status: "pending",
    progress: 0,
  },
  {
    id: "skill-gap",
    label: "Skill Gap Agent",
    description: "Identifies missing competencies",
    status: "pending",
    progress: 0,
  },
  {
    id: "ranking",
    label: "Ranking Agent",
    description: "Orders candidates by fit",
    status: "pending",
    progress: 0,
  },
  {
    id: "interview-generator",
    label: "Interview Generator",
    description: "Creates tailored interview questions",
    status: "pending",
    progress: 0,
  },
  {
    id: "salary-analysis",
    label: "Salary Analysis",
    description: "Compares expectations vs budget",
    status: "pending",
    progress: 0,
  },
  {
    id: "schedule",
    label: "Schedule Agent",
    description: "Proposes interview timeline",
    status: "pending",
    progress: 0,
  },
  {
    id: "hiring-report",
    label: "Hiring Report",
    description: "Compiles final recommendation package",
    status: "pending",
    progress: 0,
  },
];

export const MOCK_ANALYTICS: AnalyticsData = {
  candidateDistribution: [
    { name: "Highly Recommended", value: 4 },
    { name: "Recommended", value: 3 },
    { name: "Needs Review", value: 3 },
  ],
  skillMatch: [
    { skill: "React", score: 88 },
    { skill: "TypeScript", score: 84 },
    { skill: "Tailwind", score: 86 },
    { skill: "Next.js", score: 78 },
    { skill: "English", score: 91 },
    { skill: "Testing", score: 72 },
  ],
  experienceDistribution: [
    { range: "0–1 yrs", count: 12 },
    { range: "1–2 yrs", count: 34 },
    { range: "2–3 yrs", count: 48 },
    { range: "3–5 yrs", count: 22 },
    { range: "5+ yrs", count: 10 },
  ],
  salaryDistribution: [
    { range: "<$1.2k", count: 18 },
    { range: "$1.2–1.4k", count: 42 },
    { range: "$1.4–1.6k", count: 38 },
    { range: "$1.6–1.8k", count: 20 },
    { range: ">$1.8k", count: 8 },
  ],
  recruitmentTimeline: [
    { stage: "Sourcing", days: 2 },
    { stage: "Parsing", days: 1 },
    { stage: "Matching", days: 1 },
    { stage: "Ranking", days: 1 },
    { stage: "Interviews", days: 5 },
    { stage: "Offer", days: 2 },
  ],
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  activeRequests: 3,
  totalCandidates: 126,
  interviewsScheduled: 5,
  avgMatchScore: 91,
  hireRate: 34,
  timeToHire: 12,
};

export function buildMockPlan(request: string): RecruitmentPlan {
  return {
    id: `plan-${Date.now()}`,
    request,
    createdAt: new Date().toISOString(),
    summary: MOCK_SUMMARY,
    candidates: [...MOCK_CANDIDATES].sort(
      (a, b) => b.matchScore - a.matchScore
    ),
    skillGap: MOCK_SKILL_GAP,
    interviewQuestions: MOCK_INTERVIEW_QUESTIONS,
    salaryAnalyses: MOCK_SALARY_ANALYSES,
    schedule: MOCK_SCHEDULE,
    recommendations: MOCK_RECOMMENDATIONS,
    agents: MOCK_AGENTS.map((a) => ({ ...a })),
    processingTimeMs: 4200,
    confidenceScore: 0.91,
    explainability: {
      requirement: {
        provider: "demo",
        extractedSkills: ["React", "TypeScript", "Tailwind CSS"],
        budget: 1500,
      },
      matching: {
        method: "tfidf+skill-overlap",
        weights: {
          skill: 0.45,
          semantic: 0.25,
          experience: 0.15,
          salary: 0.1,
          english: 0.05,
        },
        topScore: 96,
      },
    },
  };
}
