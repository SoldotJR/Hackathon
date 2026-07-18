import type { CandidateEmail, CommunicationEvent } from '../../types/automation'
import { mockEmails } from '../mock/automation'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

const templates: Record<CommunicationEvent, (name: string) => { subject: string; body: string }> = {
  'Resume Received': (name) => ({
    subject: `We received your application`,
    body: `Hi ${name},\n\nThanks for applying. Our screening agent has queued your resume and you'll hear from us soon.\n\nBest,\nTalentPilot Recruiting`,
  }),
  'Interview Invitation': (name) => ({
    subject: `Interview invitation`,
    body: `Hi ${name},\n\nWe'd love to invite you to interview. Reply with your availability and we'll confirm a slot.\n\nBest,\nTalentPilot Recruiting`,
  }),
  'Interview Completed': (name) => ({
    subject: `Thanks for interviewing with TalentPilot`,
    body: `Hi ${name},\n\nThank you for speaking with us. We're aligning internally and will share next steps shortly.\n\nBest,\nTalentPilot Recruiting`,
  }),
  Selected: (name) => ({
    subject: `Great news from TalentPilot`,
    body: `Hi ${name},\n\nCongratulations — the team would like to move forward. An offer draft is being prepared.\n\nBest,\nTalentPilot Recruiting`,
  }),
  Rejected: (name) => ({
    subject: `Update on your application`,
    body: `Hi ${name},\n\nThank you for your time and thoughtfulness. We've decided to move forward with other candidates this round, and we truly appreciate you.\n\nWarmly,\nTalentPilot Recruiting`,
  }),
}

export async function listEmails(): Promise<CandidateEmail[]> {
  await delay()
  return mockEmails.map((email) => ({ ...email }))
}

export async function generateEmail(
  candidateName: string,
  event: CommunicationEvent,
): Promise<CandidateEmail> {
  await delay(280)
  const draft = templates[event](candidateName)
  const email: CandidateEmail = {
    id: `e-${Date.now()}`,
    candidateId: 'new',
    candidateName,
    event,
    subject: draft.subject,
    body: draft.body,
    status: 'Pending',
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  }
  mockEmails.unshift(email)
  return { ...email }
}

export async function updateEmail(
  id: string,
  patch: Partial<Pick<CandidateEmail, 'subject' | 'body' | 'status'>>,
): Promise<CandidateEmail | null> {
  await delay(160)
  const email = mockEmails.find((item) => item.id === id)
  if (!email) return null
  Object.assign(email, patch)
  return { ...email }
}

export async function sendEmail(id: string): Promise<CandidateEmail | null> {
  return updateEmail(id, { status: 'Sent' })
}
