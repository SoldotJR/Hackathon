export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function titleCaseStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
