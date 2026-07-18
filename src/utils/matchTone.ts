export function matchTone(score: number): 'high' | 'mid' | 'low' {
  if (score >= 85) return 'high'
  if (score >= 75) return 'mid'
  return 'low'
}
