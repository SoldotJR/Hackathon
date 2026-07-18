export type AgentMode = 'scout' | 'screen' | 'helpdesk' | 'ops'

export interface AgentTask {
  id: string
  title: string
  detail: string
  mode: AgentMode
  status: 'queued' | 'running' | 'done'
}

export interface AgentMessage {
  id: string
  role: 'user' | 'agent'
  text: string
  at: string
}
