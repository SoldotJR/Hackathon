import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { TimelineList } from '../../components/TimelineList'
import { listFollowUps } from '../../services/automation/followup'
import type { FollowUpCase } from '../../types/automation'

export function FollowUpPage() {
  const [cases, setCases] = useState<FollowUpCase[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void listFollowUps().then((data) => {
      setCases(data)
      setSelectedId(data[0]?.id ?? null)
      setLoading(false)
    })
  }, [])

  const selected = cases.find((item) => item.id === selectedId) ?? null

  return (
    <AppShell title="Follow-up Center">
      <PageHeader
        eyebrow="Automation"
        title="Candidate Follow-up Agent"
        description="Watch for silent invitations, send reminders, and mark inactive candidates for recruiter attention."
      />

      {loading ? (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} /> Loading follow-ups…
        </p>
      ) : (
        <div className="auto-split auto-split--2">
          <section className="glass-panel">
            <h2>Monitored candidates</h2>
            <div className="stack-list">
              {cases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`stack-item${item.id === selectedId ? ' is-active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="stack-item__top">
                    <strong>{item.candidateName}</strong>
                    <StatusBadge status={item.state} />
                  </div>
                  <p>{item.role}</p>
                  <span>
                    Invited {item.invitationSentAt} · day {item.daysSinceInvite}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-panel">
            {selected ? (
              <>
                <h2>{selected.candidateName}</h2>
                <p className="muted-line">{selected.nextAction}</p>
                <div className="flow-steps">
                  <span>Invitation sent</span>
                  <span>Wait 3 days</span>
                  <span>Reminder</span>
                  <span>Wait 4 days</span>
                  <span>Inactive</span>
                </div>
                <TimelineList
                  items={selected.timeline.map((step) => ({
                    id: step.id,
                    title: step.title,
                    detail: step.detail,
                    at: step.at,
                    agent: 'Follow-up',
                    status: selected.state,
                  }))}
                />
              </>
            ) : null}
          </section>
        </div>
      )}
    </AppShell>
  )
}
