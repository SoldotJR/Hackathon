/**
 * Automation API service layer — REST-ready with mock fallback.
 */
import type { ApiResponse } from "@/types";
import type {
  ActivityEvent,
  AppNotification,
  AutomationAgent,
  AutomationStats,
  CandidateEmail,
  CommunicationEvent,
  FollowUpRule,
  InterviewEvaluationResult,
  InterviewReminder,
  OfferLetter,
  ScheduleSuggestion,
} from "@/types/automation";
import { apiFetch, isApiReachable } from "./api";
import {
  AUTOMATION_PIPELINE,
  MOCK_ACTIVITY,
  MOCK_AUTOMATION_STATS,
  MOCK_EMAILS,
  MOCK_EVALUATIONS,
  MOCK_FOLLOWUPS,
  MOCK_NOTIFICATIONS,
  MOCK_OFFERS,
  MOCK_REMINDERS,
  MOCK_SCHEDULES,
} from "./automation-mock";

async function withFallback<T>(
  path: string,
  fallback: T,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    if (await isApiReachable()) {
      return await apiFetch<ApiResponse<T>>(path, init);
    }
  } catch {
    /* offline */
  }
  return { success: true, data: fallback };
}

export function getEmails() {
  return withFallback("/api/automation/emails", [...MOCK_EMAILS]);
}

export async function generateEmail(
  event: CommunicationEvent,
  candidateName: string
): Promise<ApiResponse<CandidateEmail>> {
  try {
    if (await isApiReachable()) {
      return await apiFetch("/api/automation/emails/generate", {
        method: "POST",
        body: JSON.stringify({ event, candidateName }),
      });
    }
  } catch {
    /* fallback */
  }
  const templates: Record<CommunicationEvent, { subject: string; body: string }> = {
    "Resume Received": {
      subject: `We received your application — TalentPilot Labs`,
      body: `Dear ${candidateName},\n\nThank you for applying. We have received your resume and will review it shortly.\n\nBest regards,\nTalent Acquisition`,
    },
    "Interview Invitation": {
      subject: `Interview Invitation`,
      body: `Dear ${candidateName},\n\nWe would like to invite you to an interview. Please share your availability.\n\nBest regards,\nTalent Acquisition`,
    },
    "Interview Completed": {
      subject: `Thank you for interviewing`,
      body: `Dear ${candidateName},\n\nThank you for speaking with us. We will follow up after the hiring panel reviews feedback.\n\nBest regards,\nTalent Acquisition`,
    },
    "Offer Congratulation": {
      subject: `Congratulations — offer from TalentPilot Labs`,
      body: `Dear ${candidateName},\n\nCongratulations! We are excited to move forward with an offer. Details follow in a secure pack.\n\nWarm regards,\nPeople Team`,
    },
    Rejection: {
      subject: `Update on your application`,
      body: `Dear ${candidateName},\n\nThank you for your interest. After careful consideration, we will not be moving forward at this time. We appreciate your time.\n\nKind regards,\nTalent Acquisition`,
    },
  };
  const t = templates[event];
  return {
    success: true,
    data: {
      id: `em-${Date.now()}`,
      candidateId: "local",
      candidateName,
      event,
      subject: t.subject,
      body: t.body,
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  };
}

export function getReminders() {
  return withFallback("/api/automation/reminders", [...MOCK_REMINDERS]);
}

export function getFollowUps() {
  return withFallback("/api/automation/followups", [...MOCK_FOLLOWUPS]);
}

export function getSchedules() {
  return withFallback("/api/automation/schedules", [...MOCK_SCHEDULES]);
}

export async function confirmSchedule(
  id: string
): Promise<ApiResponse<ScheduleSuggestion>> {
  try {
    if (await isApiReachable()) {
      return await apiFetch(`/api/automation/schedules/${id}/confirm`, {
        method: "POST",
      });
    }
  } catch {
    /* fallback */
  }
  const found = MOCK_SCHEDULES.find((s) => s.id === id) ?? MOCK_SCHEDULES[0];
  return { success: true, data: { ...found, confirmed: true } };
}

export function getEvaluations() {
  return withFallback("/api/automation/evaluations", [...MOCK_EVALUATIONS]);
}

export async function runEvaluation(payload: {
  candidateName: string;
  notes: string;
}): Promise<ApiResponse<InterviewEvaluationResult>> {
  try {
    if (await isApiReachable()) {
      return await apiFetch("/api/automation/evaluations", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
  } catch {
    /* fallback */
  }
  return {
    success: true,
    data: {
      id: `ev-${Date.now()}`,
      candidateId: "local",
      candidateName: payload.candidateName,
      summary: `Based on interviewer notes: ${payload.notes.slice(0, 160) || "Solid overall performance."}`,
      strengths: ["Clear communication", "Relevant experience"],
      weaknesses: ["Needs deeper system design"],
      communication: 85,
      technical: 82,
      cultureFit: 88,
      confidence: 0.8,
      recommendation: "Recommended",
      notes: payload.notes,
    },
  };
}

export function getOffers() {
  return withFallback("/api/automation/offers", [...MOCK_OFFERS]);
}

export async function generateOffer(candidateName: string, role: string) {
  try {
    if (await isApiReachable()) {
      return await apiFetch<ApiResponse<OfferLetter>>("/api/automation/offers", {
        method: "POST",
        body: JSON.stringify({ candidateName, role }),
      });
    }
  } catch {
    /* fallback */
  }
  return {
    success: true as const,
    data: {
      ...MOCK_OFFERS[0],
      id: `of-${Date.now()}`,
      candidateName,
      role,
      status: "Draft" as const,
      letterBody: MOCK_OFFERS[0].letterBody.replace("Emily Johnson", candidateName),
    },
  };
}

export function getActivity() {
  return withFallback("/api/automation/activity", [...MOCK_ACTIVITY]);
}

export function getNotifications() {
  return withFallback("/api/automation/notifications", [...MOCK_NOTIFICATIONS]);
}

export function getAutomationStats() {
  return withFallback("/api/automation/stats", { ...MOCK_AUTOMATION_STATS });
}

export function getAutomationPipeline() {
  return withFallback("/api/automation/pipeline", [...AUTOMATION_PIPELINE]);
}

export type {
  CandidateEmail,
  InterviewReminder,
  FollowUpRule,
  ScheduleSuggestion,
  InterviewEvaluationResult,
  OfferLetter,
  ActivityEvent,
  AppNotification,
  AutomationStats,
  AutomationAgent,
};
