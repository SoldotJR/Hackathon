import type { EvaluationDraft } from '../../types/automation'
import { mockEvaluations } from '../mock/automation'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listEvaluations(): Promise<EvaluationDraft[]> {
  await delay()
  return mockEvaluations.map((item) => ({
    ...item,
    strengths: [...item.strengths],
    risks: [...item.risks],
  }))
}
