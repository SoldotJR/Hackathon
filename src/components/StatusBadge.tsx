type Props = {
  status: string
}

export function StatusBadge({ status }: Props) {
  const key = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`status-badge status-badge--${key}`}>{status}</span>
}
