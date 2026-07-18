import { motion } from 'framer-motion'
import { CalendarClock, Check, LoaderCircle, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { TimelineList } from '../../components/TimelineList'
import { listReminders } from '../../services/automation/reminders'
import {
  confirmSchedule,
  listSchedules,
  listSlots,
} from '../../services/automation/scheduling'
import type {
  InterviewReminder,
  ScheduleSuggestion,
  TimeSlot,
} from '../../types/automation'

export function SchedulingPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [schedules, setSchedules] = useState<ScheduleSuggestion[]>([])
  const [reminders, setReminders] = useState<InterviewReminder[]>([])
  const [confirmed, setConfirmed] = useState<ScheduleSuggestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([listSlots(), listSchedules(), listReminders()]).then(
      ([slotData, scheduleData, reminderData]) => {
        setSlots(slotData)
        setSchedules(scheduleData)
        setReminders(reminderData)
        setLoading(false)
      },
    )
  }, [])

  async function onConfirm(id: string) {
    const updated = await confirmSchedule(id)
    if (!updated) return
    setSchedules((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    setConfirmed(updated)
  }

  return (
    <AppShell title="Interview Scheduling">
      <PageHeader
        eyebrow="Automation"
        title="Interview Scheduling & Reminders"
        description="Match availability, suggest slots, create Meet links, and auto-schedule 24h / 1h / 10m reminders."
      />

      {loading ? (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} /> Loading schedule…
        </p>
      ) : (
        <>
          <div className="metric-strip">
            <div className="glass-panel">
              <span>Open slots</span>
              <strong>{slots.filter((slot) => slot.availableFor === 'Both').length}</strong>
            </div>
            <div className="glass-panel">
              <span>Suggestions</span>
              <strong>{schedules.length}</strong>
            </div>
            <div className="glass-panel">
              <span>Upcoming reminders</span>
              <strong>{reminders.filter((item) => item.status === 'Upcoming').length}</strong>
            </div>
          </div>

          <div className="auto-split auto-split--2">
            <section className="glass-panel">
              <h2>Availability</h2>
              <div className="slot-grid">
                {slots.map((slot) => (
                  <article key={slot.id} className="slot-card">
                    <strong>{slot.day}</strong>
                    <p>
                      {slot.start}–{slot.end} {slot.timezone}
                    </p>
                    <StatusBadge status={slot.availableFor} />
                  </article>
                ))}
              </div>
            </section>

            <section className="glass-panel">
              <h2>Schedule suggestions</h2>
              <div className="stack-list">
                {schedules.map((item) => (
                  <motion.article
                    key={item.id}
                    className="stack-item static"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="stack-item__top">
                      <strong>{item.candidateName}</strong>
                      <StatusBadge status={item.status} />
                    </div>
                    <p>
                      {item.role} · {item.durationMinutes} min
                    </p>
                    <p>
                      {item.slot.day} · {item.slot.start}–{item.slot.end} {item.slot.timezone}
                    </p>
                    <p className="meet-link">
                      <Video size={14} /> {item.meetLink}
                    </p>
                    {item.status !== 'Confirmed' ? (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => void onConfirm(item.id)}
                      >
                        <Check size={15} /> Confirm schedule
                      </button>
                    ) : null}
                  </motion.article>
                ))}
              </div>
            </section>
          </div>

          {confirmed ? (
            <section className="glass-panel confirm-banner">
              <CalendarClock size={18} />
              <div>
                <h2>Confirmed</h2>
                <p>
                  {confirmed.candidateName} · {confirmed.slot.day} {confirmed.slot.start}{' '}
                  {confirmed.slot.timezone}
                </p>
                <p className="meet-link">{confirmed.meetLink}</p>
              </div>
            </section>
          ) : null}

          <section className="glass-panel">
            <h2>Interview Reminder Agent</h2>
            <p className="muted-line" style={{ marginBottom: '1rem' }}>
              Automatic reminders at 24 hours, 1 hour, and 10 minutes before each interview.
            </p>
            <TimelineList
              items={reminders.map((item) => ({
                id: item.id,
                title: `${item.offset} reminder · ${item.candidateName}`,
                detail: `${item.interviewAt} · ${item.channel} · delivery ${item.delivery}`,
                at: item.interviewAt,
                status: item.status,
                agent: 'Reminder',
              }))}
            />
          </section>
        </>
      )}
    </AppShell>
  )
}
