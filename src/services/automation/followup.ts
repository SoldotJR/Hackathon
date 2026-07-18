import type { FollowUpCase } from '../../types/automation'
import { mockFollowUps } from '../mock/automation'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listFollowUps(): Promise<FollowUpCase[]> {
  await delay()
  return mockFollowUps.map((item) => ({
    ...item,
    timeline: item.timeline.map((step) => ({ ...step })),
  }))
}
