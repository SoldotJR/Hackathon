# TalentPilot AI

**Agentic AI HR Recruitment Manager** — autonomous multi-agent hiring pipeline with a premium SaaS frontend.

> The Future of Autonomous Recruitment

## Architecture

```
talentpilot-ai/
├── app/                 # Next.js 15 App Router (landing + dashboard)
├── components/          # UI, layout, 3D scenes
├── features/            # Domain modules (recruitment, candidates, workflow…)
├── services/            # REST client → FastAPI (mock fallback if offline)
├── store/               # Zustand
├── types/               # Shared TypeScript contracts
└── backend/             # FastAPI multi-agent system
    ├── agents/          # Master + 9 specialist agents
    ├── api/             # Thin route layer
    ├── services/        # LLM, parsing, embeddings, reports
    ├── schemas/         # Pydantic models
    └── main.py
```

## Multi-agent pipeline

```
Master Agent
 → Requirement Analysis
 → Resume Parsing
 → Candidate Matching
 → Skill Gap
 → Ranking
 → Interview Questions
 → Salary Compatibility
 → Interview Scheduling
 → Hiring Recommendation
```

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow, R3F, Recharts |
| Backend | FastAPI, Pydantic |
| AI | Google Gemini (primary), Groq (fallback), heuristic mode when no keys |
| Parsing | PyMuPDF, pdfplumber |
| Embeddings | TF-IDF / optional Sentence-Transformers |
| Auth / DB | Supabase-ready (in-memory store works out of the box) |

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env
# Add GEMINI_API_KEY (free): https://aistudio.google.com/apikey

uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
# from repo root
npm install
copy .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

Without a running backend, the UI still works in **demo mode** (mock data).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/recruit` | Run full agent pipeline |
| POST | `/api/upload-resume` | Upload PDF resume |
| GET | `/api/candidates` | Ranked candidates |
| GET | `/api/workflow` | Agent workflow status |
| GET | `/api/report?format=json\|pdf\|csv` | Recruitment report |
| GET | `/api/analytics` | Chart data |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/health` | Health + LLM provider |

## Demo flow

1. Landing → **Launch Dashboard**
2. **Recruitment** → paste hiring request (or use sample) → optional resume upload / voice
3. Watch the agent graph animate
4. Explore ranking, skill radar, interviews, salary, schedule, recommendations
5. Export **PDF** or **CSV**

## Environment

**Backend** (`backend/.env`)

```
GEMINI_API_KEY=
GROQ_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deploy

- Frontend → Vercel
- Backend → Railway / Render

## License

MIT — built for hackathon excellence.
