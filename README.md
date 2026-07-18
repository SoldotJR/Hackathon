# Meridian

24/7 AI HR Recruiter and Operations Agent, plus a separate recruitment intelligence dashboard.

## Run locally

```bash
git clone https://github.com/SoldotJR/Hackathon.git
cd Hackathon
npm install
npm run dev
```

- **Original agent workspace:** http://localhost:5173/
- **Recruitment dashboard (new):** http://localhost:5173/recruitment

## Architecture

Original Meridian code stays at `src/App.tsx`, `src/lib/`, `src/data/`.

Friend's recruitment module is additive:

```
src/
  app/AppRouter.tsx
  features/recruitment/
  components/          # CandidateCard, SkillRadar, …
  hooks/
  services/recruitment.ts   # Promise APIs (swap for backend later)
  services/mock/            # mock data (services only)
  types/
  store/
  utils/
  styles/recruitment.css
```

Components call `services/` only — never mock data directly.
