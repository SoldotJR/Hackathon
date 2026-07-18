export type NavItem = {
  to: string
  label: string
  end?: boolean
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export const mainNav: NavItem[] = [
  { to: '/', label: 'Master Agent', end: true },
  { to: '/recruitment', label: 'Recruitment' },
]

export const automationNav: NavItem[] = [
  { to: '/automation/communication', label: 'Candidate Communication' },
  { to: '/automation/scheduling', label: 'Interview Scheduling' },
  { to: '/automation/evaluation', label: 'Interview Evaluation' },
  { to: '/automation/follow-up', label: 'Follow-up Center' },
  { to: '/automation/offers', label: 'Offer Management' },
  { to: '/automation/timeline', label: 'Activity Timeline' },
]

export const navSections: NavSection[] = [
  { title: 'Workspace', items: mainNav },
  { title: 'Automation', items: automationNav },
]
