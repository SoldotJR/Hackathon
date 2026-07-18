import { create } from "zustand";
import type {
  AgentId,
  RecruitmentPlan,
  WorkflowAgent,
} from "@/types";

export type RecruitmentPhase = "idle" | "processing" | "complete";

interface RecruitmentState {
  request: string;
  phase: RecruitmentPhase;
  agents: WorkflowAgent[];
  activeAgentId: AgentId | null;
  plan: RecruitmentPlan | null;
  selectedCandidateId: string | null;
  setRequest: (request: string) => void;
  setPhase: (phase: RecruitmentPhase) => void;
  setAgents: (agents: WorkflowAgent[], activeId?: AgentId | null) => void;
  setPlan: (plan: RecruitmentPlan | null) => void;
  setSelectedCandidateId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  request: "",
  phase: "idle" as RecruitmentPhase,
  agents: [] as WorkflowAgent[],
  activeAgentId: null as AgentId | null,
  plan: null as RecruitmentPlan | null,
  selectedCandidateId: null as string | null,
};

export const useRecruitmentStore = create<RecruitmentState>((set) => ({
  ...initialState,
  setRequest: (request) => set({ request }),
  setPhase: (phase) => set({ phase }),
  setAgents: (agents, activeId = null) =>
    set({ agents, activeAgentId: activeId }),
  setPlan: (plan) => set({ plan }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),
  reset: () => set({ ...initialState }),
}));
