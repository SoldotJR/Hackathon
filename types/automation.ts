/** Autonomous recruitment automation types */

export type EmailStatus = "Pending" | "Scheduled" | "Sent" | "Failed";

export type CommunicationEvent =
  | "Resume Received"
  | "Interview Invitation"
  | "Interview Completed"
  | "Offer Congratulation"
  | "Rejection";

export interface CandidateEmail {
  id: string;
  candidateId: string;
  candidateName: string;
  event: CommunicationEvent;
  subject: string;
  body: string;
  status: EmailStatus;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

export interface InterviewReminder {
  id: string;
  candidateName: string;
  interviewAt: string;
  offsetLabel: "24 hours" | "1 hour" | "10 minutes";
  status: "Upcoming" | "Sent" | "Failed" | "Cancelled";
  channel: "Email" | "In-app";
}

export interface FollowUpRule {
  id: string;
  candidateName: string;
  stage: string;
  daysWaiting: number;
  status: "Monitoring" | "Reminder Sent" | "Inactive" | "Replied";
  nextAction: string;
  timeline: { at: string; label: string }[];
}

export interface ScheduleSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  duration: string;
  timezone: string;
  available: boolean;
}

export interface ScheduleSuggestion {
  id: string;
  candidateName: string;
  slot: ScheduleSlot;
  meetLink: string;
  recruiterAvailable: boolean;
  candidateAvailable: boolean;
  confirmed: boolean;
}

export type EvalRecommendation =
  | "Highly Recommended"
  | "Recommended"
  | "Needs Review"
  | "Not Recommended";

export interface InterviewEvaluationResult {
  id: string;
  candidateId: string;
  candidateName: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  communication: number;
  technical: number;
  cultureFit: number;
  confidence: number;
  recommendation: EvalRecommendation;
  notes: string;
}

export interface OfferLetter {
  id: string;
  candidateId: string;
  candidateName: string;
  role: string;
  salarySummary: string;
  benefits: string[];
  joiningDate: string;
  companyIntro: string;
  onboarding: string[];
  letterBody: string;
  status: "Draft" | "Approved" | "Sent";
}

export interface ActivityEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  agent: string;
  status: "success" | "pending" | "error" | "scheduled";
}

export type {
  AppNotification,
  NotificationAction,
  NotificationCategory,
  NotificationKind,
} from "@/types/notifications";

export interface AutomationStats {
  emailsSentToday: number;
  pendingFollowUps: number;
  upcomingInterviews: number;
  candidatesWaiting: number;
  offerLettersSent: number;
  automationSuccessRate: number;
}

export interface AutomationAgent {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
}
