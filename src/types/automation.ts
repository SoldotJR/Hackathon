export type EmailStatus = 'Pending' | 'Scheduled' | 'Sent' | 'Failed'

export type CommunicationEvent =
  | 'Resume Received'
  | 'Interview Invitation'
  | 'Interview Completed'
  | 'Selected'
  | 'Rejected'

export interface CandidateEmail {
  id: string
  candidateId: string
  candidateName: string
  event: CommunicationEvent
  subject: string
  body: string
  status: EmailStatus
  createdAt: string
  scheduledFor?: string
}

export type ReminderOffset = '24h' | '1h' | '10m'
export type ReminderStatus = 'Upcoming' | 'Sent' | 'Failed' | 'Cancelled'
export type DeliveryStatus = 'Queued' | 'Delivered' | 'Bounced'

export interface InterviewReminder {
  id: string
  candidateName: string
  interviewAt: string
  offset: ReminderOffset
  status: ReminderStatus
  delivery: DeliveryStatus
  channel: 'Email' | 'SMS'
}

export type FollowUpState = 'Waiting' | 'Reminder sent' | 'Inactive' | 'Replied'

export interface FollowUpCase {
  id: string
  candidateName: string
  role: string
  invitationSentAt: string
  daysSinceInvite: number
  state: FollowUpState
  nextAction: string
  timeline: { id: string; title: string; at: string; detail: string }[]
}

export interface TimeSlot {
  id: string
  day: string
  start: string
  end: string
  timezone: string
  availableFor: 'Both' | 'Recruiter' | 'Candidate'
}

export interface ScheduleSuggestion {
  id: string
  candidateName: string
  role: string
  slot: TimeSlot
  durationMinutes: number
  meetLink: string
  status: 'Suggested' | 'Confirmed' | 'Declined'
}

export interface EvaluationDraft {
  id: string
  candidateName: string
  role: string
  score: number
  recommendation: 'Advance' | 'Hold' | 'Reject'
  summary: string
  strengths: string[]
  risks: string[]
}

export interface OfferDraft {
  id: string
  candidateName: string
  role: string
  salary: string
  startDate: string
  status: 'Draft' | 'Ready' | 'Sent'
  body: string
}

export interface ActivityEvent {
  id: string
  agent:
    | 'Master Agent'
    | 'Communication'
    | 'Reminder'
    | 'Follow-up'
    | 'Scheduling'
    | 'Evaluation'
    | 'Offer'
  title: string
  detail: string
  at: string
  status: string
}

export interface MasterAgentSnapshot {
  agents: {
    id: string
    name: string
    status: 'Idle' | 'Running' | 'Attention'
    summary: string
  }[]
  recent: ActivityEvent[]
}
