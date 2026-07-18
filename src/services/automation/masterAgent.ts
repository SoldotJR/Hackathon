import type { MasterAgentSnapshot } from '../../types/automation'
import { mockMasterSnapshot } from '../mock/automation'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMasterAgentSnapshot(): Promise<MasterAgentSnapshot> {
  await delay()
  return {
    agents: mockMasterSnapshot.agents.map((agent) => ({ ...agent })),
    recent: mockMasterSnapshot.recent.map((event) => ({ ...event })),
  }
}

export async function orchestrate(prompt: string): Promise<string> {
  await delay(380)
  const trimmed = prompt.trim()
  return `Master Agent routed “${trimmed}” to Communication, Reminder, Follow-up, Scheduling, Evaluation, and Offer agents. Check Automation for drafts and status.`
}
