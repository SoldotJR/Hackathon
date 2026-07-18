import type { AgentMessage, AgentTask } from '../../types/agent'

export const mockTasks: AgentTask[] = [
  {
    id: 't1',
    title: 'Scout senior frontend talent in APAC',
    detail: 'Ranked 18 profiles; 4 above 85% match for design-system ownership.',
    mode: 'scout',
    status: 'done',
  },
  {
    id: 't2',
    title: 'Screen inbound People Ops Lead resumes',
    detail: 'Parsing 12 applications and drafting scorecards.',
    mode: 'screen',
    status: 'running',
  },
  {
    id: 't3',
    title: 'Answer PTO policy helpdesk queue',
    detail: '3 employee questions waiting for policy-aware replies.',
    mode: 'helpdesk',
    status: 'queued',
  },
  {
    id: 't4',
    title: 'Sync interview calendar conflicts',
    detail: 'Two overlapping panels for Thursday — propose reschedule slots.',
    mode: 'ops',
    status: 'queued',
  },
]

export const mockConversation: AgentMessage[] = [
  {
    id: 'm1',
    role: 'agent',
    text: 'Meridian online. I can scout talent, screen resumes, handle HR helpdesk, and keep hiring ops moving overnight.',
    at: '08:01',
  },
  {
    id: 'm2',
    role: 'user',
    text: 'Prioritize Frontend Engineer pipeline and clear the helpdesk before standup.',
    at: '08:03',
  },
  {
    id: 'm3',
    role: 'agent',
    text: 'On it. Frontend scout batch is ready; helpdesk draft replies staged for your review.',
    at: '08:04',
  },
]
