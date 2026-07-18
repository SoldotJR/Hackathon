import type { ScheduleSuggestion, TimeSlot } from '../../types/automation'
import { mockSchedules, mockSlots } from '../mock/automation'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listSlots(): Promise<TimeSlot[]> {
  await delay()
  return mockSlots.map((slot) => ({ ...slot }))
}

export async function listSchedules(): Promise<ScheduleSuggestion[]> {
  await delay()
  return mockSchedules.map((item) => ({ ...item, slot: { ...item.slot } }))
}

export async function confirmSchedule(id: string): Promise<ScheduleSuggestion | null> {
  await delay(220)
  const item = mockSchedules.find((schedule) => schedule.id === id)
  if (!item) return null
  item.status = 'Confirmed'
  return { ...item, slot: { ...item.slot } }
}
