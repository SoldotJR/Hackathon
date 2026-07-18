import { StatusBadge } from './StatusBadge'

export type TimelineItem = {
  id: string
  title: string
  detail: string
  at: string
  status?: string
  agent?: string
}

type Props = {
  items: TimelineItem[]
}

export function TimelineList({ items }: Props) {
  return (
    <ol className="timeline-list">
      {items.map((item) => (
        <li key={item.id}>
          <div className="timeline-list__dot" aria-hidden="true" />
          <div className="timeline-list__body">
            <div className="timeline-list__top">
              <strong>{item.title}</strong>
              <time>{item.at}</time>
            </div>
            <p>{item.detail}</p>
            <div className="timeline-list__meta">
              {item.agent ? <span>{item.agent}</span> : null}
              {item.status ? <StatusBadge status={item.status} /> : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
