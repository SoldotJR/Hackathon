import type { AgentMessage, AgentTask } from '../types/agent'
import { mockConversation, mockTasks } from './mock/agent'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getAgentTasks(): Promise<AgentTask[]> {
  await delay()
  return [...mockTasks]
}

export async function getAgentConversation(): Promise<AgentMessage[]> {
  await delay(160)
  return [...mockConversation]
}

export async function sendAgentPrompt(prompt: string): Promise<AgentMessage> {
  await delay(420)
  return {
    id: `m-${Date.now()}`,
    role: 'agent',
    text: `Acknowledged: “${prompt.trim()}”. Master Agent queued scout + screen and notified the automation agents.`,
    at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}
