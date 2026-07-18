import type {
  ActivityEvent,
  CandidateEmail,
  EvaluationDraft,
  FollowUpCase,
  InterviewReminder,
  MasterAgentSnapshot,
  OfferDraft,
  ScheduleSuggestion,
  TimeSlot,
} from '../../types/automation'

export const mockEmails: CandidateEmail[] = [
  {
    id: 'e1',
    candidateId: 'c3',
    candidateName: 'Sofia Alvarez',
    event: 'Resume Received',
    subject: 'We received your application — Talent Sourcer',
    body: `Hi Sofia,\n\nThanks for applying to the Talent Sourcer role at TalentPilot. Our screening agent has queued your resume for review and you'll hear from us within 3 business days.\n\nBest,\nTalentPilot Recruiting`,
    status: 'Sent',
    createdAt: '2026-07-16 09:12',
  },
  {
    id: 'e2',
    candidateId: 'c1',
    candidateName: 'Ava Chen',
    event: 'Interview Invitation',
    subject: 'Interview invitation — Senior Frontend Engineer',
    body: `Hi Ava,\n\nWe'd love to invite you to a 45-minute interview for Senior Frontend Engineer.\n\nProposed window: Thu 10:00–10:45 SGT.\nMeet link will follow once confirmed.\n\nBest,\nTalentPilot Recruiting`,
    status: 'Scheduled',
    createdAt: '2026-07-17 14:20',
    scheduledFor: '2026-07-18 08:00',
  },
  {
    id: 'e3',
    candidateId: 'c4',
    candidateName: 'Jonah Reed',
    event: 'Selected',
    subject: 'Great news from TalentPilot',
    body: `Hi Jonah,\n\nCongratulations — the team loved speaking with you. We're preparing an offer for Backend Engineer and will share details shortly.\n\nBest,\nTalentPilot Recruiting`,
    status: 'Pending',
    createdAt: '2026-07-18 07:40',
  },
  {
    id: 'e4',
    candidateId: 'c6',
    candidateName: 'Eli Park',
    event: 'Rejected',
    subject: 'Update on your Frontend Engineer application',
    body: `Hi Eli,\n\nThank you for the time and care you put into the process. We've decided to move forward with candidates whose experience more closely matches our design-system ownership needs.\n\nWe truly appreciate you and hope our paths cross again.\n\nWarmly,\nTalentPilot Recruiting`,
    status: 'Failed',
    createdAt: '2026-07-17 18:05',
  },
]

export const mockReminders: InterviewReminder[] = [
  {
    id: 'r1',
    candidateName: 'Ava Chen',
    interviewAt: '2026-07-19 10:00 SGT',
    offset: '24h',
    status: 'Upcoming',
    delivery: 'Queued',
    channel: 'Email',
  },
  {
    id: 'r2',
    candidateName: 'Ava Chen',
    interviewAt: '2026-07-19 10:00 SGT',
    offset: '1h',
    status: 'Upcoming',
    delivery: 'Queued',
    channel: 'Email',
  },
  {
    id: 'r3',
    candidateName: 'Ava Chen',
    interviewAt: '2026-07-19 10:00 SGT',
    offset: '10m',
    status: 'Upcoming',
    delivery: 'Queued',
    channel: 'SMS',
  },
  {
    id: 'r4',
    candidateName: 'Marcus Okonkwo',
    interviewAt: '2026-07-17 15:00 WAT',
    offset: '1h',
    status: 'Sent',
    delivery: 'Delivered',
    channel: 'Email',
  },
]

export const mockFollowUps: FollowUpCase[] = [
  {
    id: 'f1',
    candidateName: 'Sofia Alvarez',
    role: 'Talent Sourcer',
    invitationSentAt: '2026-07-13',
    daysSinceInvite: 5,
    state: 'Reminder sent',
    nextAction: 'Wait 2 more days, then mark inactive if no reply',
    timeline: [
      {
        id: 'ft1',
        title: 'Interview invitation sent',
        at: 'Jul 13',
        detail: 'Invitation email delivered.',
      },
      {
        id: 'ft2',
        title: 'No reply after 3 days',
        at: 'Jul 16',
        detail: 'Follow-up Agent generated reminder email.',
      },
      {
        id: 'ft3',
        title: 'Reminder sent',
        at: 'Jul 16',
        detail: 'Waiting another 4 days for response.',
      },
    ],
  },
  {
    id: 'f2',
    candidateName: 'Priya Nair',
    role: 'HR Business Partner',
    invitationSentAt: '2026-07-08',
    daysSinceInvite: 10,
    state: 'Inactive',
    nextAction: 'Notify recruiter — candidate marked inactive',
    timeline: [
      {
        id: 'ft4',
        title: 'Interview invitation sent',
        at: 'Jul 8',
        detail: 'Invitation email delivered.',
      },
      {
        id: 'ft5',
        title: 'Reminder sent',
        at: 'Jul 11',
        detail: 'No reply after first reminder.',
      },
      {
        id: 'ft6',
        title: 'Marked inactive',
        at: 'Jul 15',
        detail: 'Recruiter notified by Follow-up Agent.',
      },
    ],
  },
  {
    id: 'f3',
    candidateName: 'Marcus Okonkwo',
    role: 'People Operations Lead',
    invitationSentAt: '2026-07-16',
    daysSinceInvite: 2,
    state: 'Waiting',
    nextAction: 'Check again tomorrow (day 3 threshold)',
    timeline: [
      {
        id: 'ft7',
        title: 'Interview invitation sent',
        at: 'Jul 16',
        detail: 'Monitoring for reply.',
      },
    ],
  },
]

const slots: TimeSlot[] = [
  {
    id: 's1',
    day: 'Thu, Jul 18',
    start: '10:00',
    end: '10:45',
    timezone: 'SGT',
    availableFor: 'Both',
  },
  {
    id: 's2',
    day: 'Thu, Jul 18',
    start: '14:00',
    end: '14:45',
    timezone: 'SGT',
    availableFor: 'Recruiter',
  },
  {
    id: 's3',
    day: 'Fri, Jul 19',
    start: '09:30',
    end: '10:15',
    timezone: 'SGT',
    availableFor: 'Both',
  },
  {
    id: 's4',
    day: 'Fri, Jul 19',
    start: '16:00',
    end: '16:45',
    timezone: 'SGT',
    availableFor: 'Candidate',
  },
]

export const mockSlots = slots

export const mockSchedules: ScheduleSuggestion[] = [
  {
    id: 'sch1',
    candidateName: 'Ava Chen',
    role: 'Senior Frontend Engineer',
    slot: slots[0],
    durationMinutes: 45,
    meetLink: 'https://meet.google.com/talentpilot-ava-chen',
    status: 'Suggested',
  },
  {
    id: 'sch2',
    candidateName: 'Marcus Okonkwo',
    role: 'People Operations Lead',
    slot: slots[2],
    durationMinutes: 45,
    meetLink: 'https://meet.google.com/talentpilot-marcus',
    status: 'Confirmed',
  },
]

export const mockEvaluations: EvaluationDraft[] = [
  {
    id: 'ev1',
    candidateName: 'Ava Chen',
    role: 'Senior Frontend Engineer',
    score: 92,
    recommendation: 'Advance',
    summary:
      'Strong system thinking and clear ownership examples on design systems. Ready for final round.',
    strengths: ['Architecture clarity', 'Accessibility depth', 'Calm communication'],
    risks: ['Limited backend exposure — not blocking for this role'],
  },
  {
    id: 'ev2',
    candidateName: 'Jonah Reed',
    role: 'Backend Engineer',
    score: 86,
    recommendation: 'Advance',
    summary: 'Solid distributed systems instincts; offer path already in progress.',
    strengths: ['Postgres modeling', 'Ownership under ambiguity'],
    risks: ['Could deepen observability storytelling'],
  },
]

export const mockOffers: OfferDraft[] = [
  {
    id: 'o1',
    candidateName: 'Jonah Reed',
    role: 'Backend Engineer',
    salary: 'SGD 145,000',
    startDate: '2026-08-18',
    status: 'Ready',
    body: `Dear Jonah,\n\nWe are delighted to offer you the position of Backend Engineer at TalentPilot.\n\nCompensation: SGD 145,000 annually\nStart date: August 18, 2026\n\nPlease reply with your acceptance by July 25.\n\nWelcome aboard,\nTalentPilot People Team`,
  },
  {
    id: 'o2',
    candidateName: 'Priya Nair',
    role: 'HR Business Partner',
    salary: 'SGD 132,000',
    startDate: '2026-08-04',
    status: 'Sent',
    body: `Dear Priya,\n\nCongratulations — please find your offer for HR Business Partner enclosed conceptually in this draft.\n\nCompensation: SGD 132,000 annually\nStart date: August 4, 2026\n\nWarmly,\nTalentPilot People Team`,
  },
]

export const mockActivity: ActivityEvent[] = [
  {
    id: 'a1',
    agent: 'Master Agent',
    title: 'Orchestrated overnight hiring pass',
    detail: 'Delegated scout, screen, reminders, and follow-ups across open roles.',
    at: '2026-07-18 07:05',
    status: 'Done',
  },
  {
    id: 'a2',
    agent: 'Communication',
    title: 'Drafted congratulation email',
    detail: 'Jonah Reed — awaiting HR send approval.',
    at: '2026-07-18 07:40',
    status: 'Pending',
  },
  {
    id: 'a3',
    agent: 'Reminder',
    title: 'Scheduled 24h / 1h / 10m reminders',
    detail: 'Ava Chen interview on Jul 19.',
    at: '2026-07-18 08:10',
    status: 'Scheduled',
  },
  {
    id: 'a4',
    agent: 'Follow-up',
    title: 'Escalated inactive candidate',
    detail: 'Priya Nair marked inactive after no reply.',
    at: '2026-07-15 11:20',
    status: 'Attention',
  },
  {
    id: 'a5',
    agent: 'Scheduling',
    title: 'Confirmed interview slot',
    detail: 'Marcus Okonkwo — Fri 09:30 SGT.',
    at: '2026-07-17 16:02',
    status: 'Confirmed',
  },
  {
    id: 'a6',
    agent: 'Evaluation',
    title: 'Generated interview scorecard',
    detail: 'Ava Chen scored 92 — recommend advance.',
    at: '2026-07-17 19:44',
    status: 'Ready',
  },
  {
    id: 'a7',
    agent: 'Offer',
    title: 'Prepared offer letter draft',
    detail: 'Jonah Reed offer ready for review.',
    at: '2026-07-18 06:55',
    status: 'Ready',
  },
]

export const mockMasterSnapshot: MasterAgentSnapshot = {
  agents: [
    {
      id: 'comm',
      name: 'Candidate Communication',
      status: 'Running',
      summary: '3 drafts need review · 1 failed send',
    },
    {
      id: 'remind',
      name: 'Interview Reminder',
      status: 'Running',
      summary: '3 upcoming reminders for Ava Chen',
    },
    {
      id: 'follow',
      name: 'Candidate Follow-up',
      status: 'Attention',
      summary: '1 inactive escalation for recruiter',
    },
    {
      id: 'sched',
      name: 'Interview Scheduling',
      status: 'Idle',
      summary: '1 suggestion awaiting confirmation',
    },
    {
      id: 'eval',
      name: 'Interview Evaluation',
      status: 'Idle',
      summary: '2 scorecards ready',
    },
    {
      id: 'offer',
      name: 'Offer Letter',
      status: 'Attention',
      summary: '1 offer ready to send',
    },
  ],
  recent: mockActivity.slice(0, 4),
}
