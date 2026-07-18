# TalentPilot AI

Agentic AI HR Recruitment Manager — dashboard, ranking, screening, and autonomous hiring agents.

## Run locally

```bash
git clone https://github.com/SoldotJR/Hackathon.git
cd Hackathon
npm install
npm run dev
```

- **Master Agent:** http://localhost:5173/
- **Recruitment pipeline:** http://localhost:5173/recruitment
- **Automation:** http://localhost:5173/automation/communication

## Architecture

Existing TalentPilot surfaces stay in place:

```
src/
  App.tsx                         # Master Agent workspace
  features/recruitment/           # Pipeline + ranking + analytics
  lib/ data/ hooks/ store/        # shared helpers
```

Automation is additive:

```
src/
  app/AppRouter.tsx
  components/AppShell.tsx         # shared sidebar shell
  features/automation/            # Communication, Scheduling, …
  services/automation/            # Promise APIs (swap for backend later)
  services/mock/automation.ts
  types/automation.ts
  styles/automation.css
```

Components call `services/` only — never mock data directly.

### Automation agents

1. Candidate Communication  
2. Interview Reminder  
3. Candidate Follow-up  
4. Interview Scheduling  
5. Interview Evaluation  
6. Offer Letter  

The Master Recruitment Agent orchestrates all of the above.
