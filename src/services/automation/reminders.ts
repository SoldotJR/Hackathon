import type { InterviewReminder } from '../../types/automation'
import { mockReminders } from '../mock/automation'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listReminders(): Promise<InterviewReminder[]> {
  await delay()
  return mockReminders.map((item) => ({ ...item }))
}
