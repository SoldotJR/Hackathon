/**
 * Recruitment API service — real backend with mock fallback.
 */
import type {
  AgentId,
  ApiResponse,
  GeneratePlanPayload,
  RecruitmentPlan,
  WorkflowAgent,
} from "@/types";
import { delay } from "@/utils/format";
import { MOCK_AGENTS, buildMockPlan } from "./mock-data";
import { apiFetch, isApiReachable } from "./api";

const AGENT_DURATION_MS = 550;

export interface UploadResumeResult {
  id: string;
  filename: string;
  textPreview: string;
  pages: number;
}

export async function uploadResume(
  file: File
): Promise<ApiResponse<UploadResumeResult>> {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await apiFetch<ApiResponse<UploadResumeResult>>(
      "/api/upload-resume",
      { method: "POST", body: form }
    );
    return res;
  } catch {
    // Local mock upload id for offline demo
    return {
      success: true,
      data: {
        id: `local-${Date.now()}`,
        filename: file.name,
        textPreview: `Local preview of ${file.name} (backend offline — using talent pool)`,
        pages: 1,
      },
      message: "Stored locally (API offline)",
    };
  }
}

/** Generate a full recruitment plan from a hiring request */
export async function generateRecruitmentPlan(
  payload: GeneratePlanPayload & { resume_ids?: string[] }
): Promise<ApiResponse<RecruitmentPlan>> {
  const online = await isApiReachable();
  if (online) {
    try {
      return await apiFetch<ApiResponse<RecruitmentPlan>>("/api/recruit", {
        method: "POST",
        body: JSON.stringify({
          request: payload.request,
          resume_ids: payload.resume_ids ?? [],
        }),
      });
    } catch (err) {
      console.warn("Recruit API failed, using mock:", err);
    }
  }

  await delay(400);
  const plan = buildMockPlan(payload.request);
  return {
    success: true,
    data: plan,
    message: "Recruitment plan generated (demo mode)",
  };
}

export async function getWorkflowAgents(): Promise<
  ApiResponse<WorkflowAgent[]>
> {
  try {
    return await apiFetch<ApiResponse<WorkflowAgent[]>>("/api/workflow");
  } catch {
    await delay(200);
    return { success: true, data: MOCK_AGENTS.map((a) => ({ ...a })) };
  }
}

/**
 * Simulate sequential agent execution for UI animation.
 * When the backend is online, the real recruit call does the work —
 * this still drives the React Flow visualization.
 */
export async function simulateAgentWorkflow(
  onProgress: (agents: WorkflowAgent[], activeId: AgentId | null) => void
): Promise<ApiResponse<WorkflowAgent[]>> {
  const agents: WorkflowAgent[] = MOCK_AGENTS.map((a) => ({ ...a }));

  for (let i = 0; i < agents.length; i++) {
    agents[i] = { ...agents[i], status: "running", progress: 0 };
    onProgress([...agents], agents[i].id);

    const steps = 4;
    for (let s = 1; s <= steps; s++) {
      await delay(AGENT_DURATION_MS / steps);
      agents[i] = {
        ...agents[i],
        progress: Math.round((s / steps) * 100),
      };
      onProgress([...agents], agents[i].id);
    }

    agents[i] = { ...agents[i], status: "completed", progress: 100 };
    onProgress([...agents], agents[i].id);
  }

  onProgress([...agents], null);
  return { success: true, data: agents };
}

export async function getRecruitmentPlan(
  id?: string
): Promise<ApiResponse<RecruitmentPlan>> {
  try {
    const path = id ? `/api/report?format=json&plan_id=${id}` : "/api/plan";
    return await apiFetch<ApiResponse<RecruitmentPlan>>(path);
  } catch {
    await delay(300);
    return {
      success: true,
      data: { ...buildMockPlan("Cached hiring request"), id: id || "mock" },
    };
  }
}

export function reportDownloadUrl(format: "pdf" | "csv"): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000";
  return `${base}/api/report?format=${format}`;
}
