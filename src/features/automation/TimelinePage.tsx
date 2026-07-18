import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/PageHeader'
import { TimelineList } from '../../components/TimelineList'
import { listActivity } from '../../services/automation/timeline'
import type { ActivityEvent } from '../../types/automation'

export function TimelinePage() {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void listActivity().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  return (
    <AppShell title="Activity Timeline">
      <PageHeader
        eyebrow="Automation"
        title="Activity Timeline"
        description="One place to see what the Master Agent and every sub-agent did."
      />

      {loading ? (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} /> Loading activity…
        </p>
      ) : (
        <section className="glass-panel">
          <TimelineList
            items={events.map((event) => ({
              id: event.id,
              title: event.title,
              detail: event.detail,
              at: event.at,
              status: event.status,
              agent: event.agent,
            }))}
          />
        </section>
      )}
    </AppShell>
  )
}
