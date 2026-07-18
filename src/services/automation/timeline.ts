import type { ActivityEvent } from '../../types/automation'
import { mockActivity } from '../mock/automation'

const delay = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listActivity(): Promise<ActivityEvent[]> {
  await delay()
  return mockActivity.map((item) => ({ ...item }))
}
