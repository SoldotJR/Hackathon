"""Seed talent pool used when no resumes are uploaded."""

from __future__ import annotations

SEED_CANDIDATES: list[dict] = [
    {
        "id": "c1",
        "name": "Emily Johnson",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
        "title": "Junior Frontend Developer",
        "experience": 2,
        "experienceLabel": "2 years",
        "skills": [
            {"name": "React", "level": 95},
            {"name": "TypeScript", "level": 92},
            {"name": "Tailwind CSS", "level": 94},
            {"name": "Next.js", "level": 88},
            {"name": "JavaScript", "level": 96},
            {"name": "Git", "level": 90},
        ],
        "education": [
            {
                "degree": "B.S. Computer Science",
                "institution": "University of Washington",
                "year": "2023",
            }
        ],
        "certificates": [
            {"name": "Meta Front-End Developer", "issuer": "Coursera", "year": "2024"}
        ],
        "projects": [
            {
                "name": "Pulse Dashboard",
                "description": "Real-time analytics dashboard with React and Recharts.",
                "tech": ["React", "TypeScript", "Tailwind"],
                "url": "https://github.com/emilyj/pulse",
            }
        ],
        "salary": 1400,
        "portfolio": "https://emilyjohnson.dev",
        "linkedin": "https://linkedin.com/in/emilyjohnson",
        "github": "https://github.com/emilyj",
        "resumeSummary": "Strong junior frontend engineer with polished React/TypeScript delivery and excellent English communication.",
        "location": "Seattle, WA",
        "english": True,
    },
    {
        "id": "c2",
        "name": "Marcus Chen",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
        "title": "Frontend Developer",
        "experience": 3,
        "experienceLabel": "3 years",
        "skills": [
            {"name": "React", "level": 90},
            {"name": "TypeScript", "level": 85},
            {"name": "Tailwind CSS", "level": 88},
            {"name": "Next.js", "level": 82},
            {"name": "Node.js", "level": 70},
            {"name": "Testing", "level": 78},
        ],
        "education": [
            {
                "degree": "B.Eng Software Engineering",
                "institution": "Georgia Tech",
                "year": "2022",
            }
        ],
        "certificates": [
            {"name": "AWS Cloud Practitioner", "issuer": "Amazon", "year": "2023"}
        ],
        "projects": [
            {
                "name": "Kanban Flow",
                "description": "Drag-and-drop project board with optimistic UI.",
                "tech": ["React", "DnD Kit", "Zustand"],
            }
        ],
        "salary": 1550,
        "portfolio": "https://marcuschen.dev",
        "linkedin": "https://linkedin.com/in/marcuschen",
        "github": "https://github.com/mchen",
        "resumeSummary": "Solid React foundation with strong component architecture.",
        "location": "Austin, TX",
        "english": True,
    },
    {
        "id": "c3",
        "name": "Sofia Alvarez",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia",
        "title": "Junior UI Engineer",
        "experience": 1.5,
        "experienceLabel": "1.5 years",
        "skills": [
            {"name": "React", "level": 86},
            {"name": "TypeScript", "level": 80},
            {"name": "Tailwind CSS", "level": 92},
            {"name": "Figma", "level": 88},
            {"name": "Accessibility", "level": 84},
            {"name": "CSS", "level": 95},
        ],
        "education": [
            {
                "degree": "B.A. Interactive Media",
                "institution": "RISD",
                "year": "2024",
            }
        ],
        "certificates": [
            {"name": "Google UX Design", "issuer": "Google", "year": "2024"}
        ],
        "projects": [
            {
                "name": "A11y Kit",
                "description": "Accessible component library built with Tailwind.",
                "tech": ["React", "Tailwind", "Storybook"],
            }
        ],
        "salary": 1250,
        "portfolio": "https://sofiaalvarez.design",
        "linkedin": "https://linkedin.com/in/sofiaalvarez",
        "github": "https://github.com/sofiaalv",
        "resumeSummary": "Design-fluent frontend talent with excellent Tailwind craft.",
        "location": "Remote — LATAM",
        "english": True,
    },
    {
        "id": "c4",
        "name": "James Okonkwo",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
        "title": "Full-Stack Developer",
        "experience": 4,
        "experienceLabel": "4 years",
        "skills": [
            {"name": "React", "level": 88},
            {"name": "TypeScript", "level": 90},
            {"name": "Node.js", "level": 92},
            {"name": "PostgreSQL", "level": 85},
            {"name": "Tailwind CSS", "level": 70},
            {"name": "Docker", "level": 80},
        ],
        "education": [
            {
                "degree": "M.S. Computer Science",
                "institution": "University of Toronto",
                "year": "2021",
            }
        ],
        "certificates": [
            {"name": "Kubernetes Administrator", "issuer": "CNCF", "year": "2023"}
        ],
        "projects": [
            {
                "name": "HireStack API",
                "description": "Recruitment API platform with FastAPI and React.",
                "tech": ["React", "FastAPI", "Postgres"],
            }
        ],
        "salary": 1800,
        "portfolio": "https://jamesok.dev",
        "linkedin": "https://linkedin.com/in/jamesok",
        "github": "https://github.com/jamesok",
        "resumeSummary": "Full-stack engineer with strong TypeScript depth; budget stretch for junior roles.",
        "location": "Toronto, CA",
        "english": True,
    },
    {
        "id": "c5",
        "name": "Priya Sharma",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
        "title": "Junior Frontend Developer",
        "experience": 1,
        "experienceLabel": "1 year",
        "skills": [
            {"name": "React", "level": 82},
            {"name": "TypeScript", "level": 78},
            {"name": "Tailwind CSS", "level": 90},
            {"name": "JavaScript", "level": 88},
            {"name": "HTML", "level": 95},
            {"name": "CSS", "level": 93},
        ],
        "education": [
            {
                "degree": "B.Tech IT",
                "institution": "NIT Trichy",
                "year": "2024",
            }
        ],
        "certificates": [
            {"name": "JavaScript Algorithms", "issuer": "freeCodeCamp", "year": "2024"}
        ],
        "projects": [
            {
                "name": "Campus Connect",
                "description": "Student networking SPA with React and Tailwind.",
                "tech": ["React", "Tailwind", "Firebase"],
            }
        ],
        "salary": 1100,
        "portfolio": "https://priyasharma.dev",
        "linkedin": "https://linkedin.com/in/priyasharma",
        "github": "https://github.com/priyas",
        "resumeSummary": "Hungry junior with clean UI execution and strong fundamentals.",
        "location": "Bangalore, IN",
        "english": True,
    },
    {
        "id": "c6",
        "name": "Liam O'Brien",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Liam",
        "title": "React Developer",
        "experience": 2.5,
        "experienceLabel": "2.5 years",
        "skills": [
            {"name": "React", "level": 91},
            {"name": "TypeScript", "level": 87},
            {"name": "Redux", "level": 84},
            {"name": "Tailwind CSS", "level": 75},
            {"name": "Jest", "level": 80},
            {"name": "GraphQL", "level": 72},
        ],
        "education": [
            {
                "degree": "B.Sc Computing",
                "institution": "Trinity College Dublin",
                "year": "2022",
            }
        ],
        "certificates": [],
        "projects": [
            {
                "name": "Ticketly",
                "description": "Event ticketing UI with React and GraphQL.",
                "tech": ["React", "Apollo", "TypeScript"],
            }
        ],
        "salary": 1450,
        "portfolio": "https://liamobrien.dev",
        "linkedin": "https://linkedin.com/in/liamob",
        "github": "https://github.com/liamob",
        "resumeSummary": "Reliable React developer with testing discipline and clear communication.",
        "location": "Dublin, IE",
        "english": True,
    },
    {
        "id": "c7",
        "name": "Aiko Tanaka",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Aiko",
        "title": "Frontend Engineer",
        "experience": 3,
        "experienceLabel": "3 years",
        "skills": [
            {"name": "React", "level": 89},
            {"name": "TypeScript", "level": 91},
            {"name": "Next.js", "level": 90},
            {"name": "Tailwind CSS", "level": 86},
            {"name": "Framer Motion", "level": 88},
            {"name": "Three.js", "level": 70},
        ],
        "education": [
            {
                "degree": "B.S. Information Science",
                "institution": "Keio University",
                "year": "2021",
            }
        ],
        "certificates": [
            {"name": "Next.js Professional", "issuer": "Vercel", "year": "2024"}
        ],
        "projects": [
            {
                "name": "Orbit UI",
                "description": "Motion-rich marketing site with R3F accents.",
                "tech": ["Next.js", "Framer Motion", "Three.js"],
            }
        ],
        "salary": 1600,
        "portfolio": "https://aikotanaka.dev",
        "linkedin": "https://linkedin.com/in/aikotanaka",
        "github": "https://github.com/aiko",
        "resumeSummary": "Polished Next.js engineer with exceptional motion and design sense.",
        "location": "Tokyo, JP",
        "english": True,
    },
    {
        "id": "c8",
        "name": "Noah Williams",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Noah",
        "title": "Junior Web Developer",
        "experience": 1,
        "experienceLabel": "1 year",
        "skills": [
            {"name": "JavaScript", "level": 85},
            {"name": "React", "level": 75},
            {"name": "HTML", "level": 92},
            {"name": "CSS", "level": 90},
            {"name": "Tailwind CSS", "level": 80},
            {"name": "TypeScript", "level": 60},
        ],
        "education": [
            {
                "degree": "Bootcamp Certificate",
                "institution": "General Assembly",
                "year": "2024",
            }
        ],
        "certificates": [
            {"name": "Front End Libraries", "issuer": "freeCodeCamp", "year": "2024"}
        ],
        "projects": [
            {
                "name": "Weather Now",
                "description": "Simple weather app with React hooks.",
                "tech": ["React", "CSS"],
            }
        ],
        "salary": 1000,
        "portfolio": "https://noahw.dev",
        "linkedin": "https://linkedin.com/in/noahwilliams",
        "github": "https://github.com/noahw",
        "resumeSummary": "Early-career developer with solid HTML/CSS and growing React skills.",
        "location": "Chicago, IL",
        "english": True,
    },
    {
        "id": "c9",
        "name": "Fatima Rahman",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Fatima",
        "title": "UI Developer",
        "experience": 2,
        "experienceLabel": "2 years",
        "skills": [
            {"name": "React", "level": 84},
            {"name": "TypeScript", "level": 82},
            {"name": "Tailwind CSS", "level": 93},
            {"name": "Storybook", "level": 85},
            {"name": "Design Systems", "level": 88},
            {"name": "CSS", "level": 94},
        ],
        "education": [
            {
                "degree": "B.S. Software Engineering",
                "institution": "AUST",
                "year": "2023",
            }
        ],
        "certificates": [
            {"name": "Advanced CSS", "issuer": "Frontend Masters", "year": "2024"}
        ],
        "projects": [
            {
                "name": "Nova DS",
                "description": "Token-driven design system with React and Tailwind.",
                "tech": ["React", "Tailwind", "Storybook"],
            }
        ],
        "salary": 1350,
        "portfolio": "https://fatimarahman.dev",
        "linkedin": "https://linkedin.com/in/fatimar",
        "github": "https://github.com/fatimar",
        "resumeSummary": "Design-system minded UI developer with crisp Tailwind execution.",
        "location": "Dhaka, BD",
        "english": True,
    },
    {
        "id": "c10",
        "name": "Ethan Brooks",
        "photo": "https://api.dicebear.com/9.x/avataaars/svg?seed=Ethan",
        "title": "Senior Frontend Developer",
        "experience": 6,
        "experienceLabel": "6 years",
        "skills": [
            {"name": "React", "level": 97},
            {"name": "TypeScript", "level": 96},
            {"name": "Next.js", "level": 94},
            {"name": "Architecture", "level": 92},
            {"name": "Tailwind CSS", "level": 80},
            {"name": "Leadership", "level": 88},
        ],
        "education": [
            {
                "degree": "B.S. Computer Science",
                "institution": "Stanford",
                "year": "2018",
            }
        ],
        "certificates": [
            {"name": "Staff Engineer Path", "issuer": "Frontend Masters", "year": "2023"}
        ],
        "projects": [
            {
                "name": "Ledger Cloud",
                "description": "Enterprise SPA architecture for fintech dashboard.",
                "tech": ["React", "TypeScript", "Nx"],
            }
        ],
        "salary": 3200,
        "portfolio": "https://ethanbrooks.dev",
        "linkedin": "https://linkedin.com/in/ethanbrooks",
        "github": "https://github.com/ethanb",
        "resumeSummary": "Senior talent — excellent skills but overqualified and over budget for junior roles.",
        "location": "San Francisco, CA",
        "english": True,
    },
]
