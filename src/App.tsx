import { motion } from 'framer-motion'
import { Bot, LoaderCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { PageHeader } from './components/PageHeader'
import { StatusBadge } from './components/StatusBadge'
import { brand } from './data/brand'
import { useAgentWorkspace } from './hooks/useAgentWorkspace'
import { getMasterAgentSnapshot, orchestrate } from './services/automation/masterAgent'
import type { MasterAgentSnapshot } from './types/automation'

const modeLabel = {
  scout: 'Scout',
  screen: 'Screen',
  helpdesk: 'Helpdesk',
  ops: 'Ops',
} as const

export default function App() {
  const { tasks, messages, prompt, setPrompt, busy, loading, submitPrompt } =
    useAgentWorkspace()
  const [master, setMaster] = useState<MasterAgentSnapshot | null>(null)
  const [routeNotice, setRouteNotice] = useState<string | null>(null)

  useEffect(() => {
    void getMasterAgentSnapshot().then(setMaster)
  }, [])

  async function onOrchestrate() {
    const text = prompt.trim()
    if (!text) return
    await submitPrompt()
    const result = await orchestrate(text)
    setRouteNotice(result)
  }

  return (
    <AppShell title="Master Agent">
      <PageHeader
        eyebrow={brand.name}
        title={brand.tagline}
        description={brand.pitch}
        actions={
          <Link className="btn btn--ghost" to="/recruitment">
            Open pipeline
          </Link>
        }
      />

      {master ? (
        <section className="agent-grid">
          {master.agents.map((agent, index) => (
            <motion.article
              key={agent.id}
              className="glass-panel agent-tile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
            >
              <div className="stack-item__top">
                <strong>{agent.name}</strong>
                <StatusBadge status={agent.status} />
              </div>
              <p>{agent.summary}</p>
            </motion.article>
          ))}
        </section>
      ) : null}

      {routeNotice ? <p className="inline-notice">{routeNotice}</p> : null}

      <section id="workspace" className="agent-workspace">
        <motion.div
          className="workspace-panel glass-panel conversation"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <header className="panel-head">
            <Bot size={18} aria-hidden="true" />
            <h2>Master Agent console</h2>
          </header>

          <div className="message-list" role="log" aria-live="polite">
            {loading ? (
              <p className="muted">
                <LoaderCircle className="spin" size={16} aria-hidden="true" /> Loading…
              </p>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={`message message--${message.role}`}
                >
                  <span>{message.role === 'agent' ? brand.shortName : 'You'}</span>
                  <p>{message.text}</p>
                  <time>{message.at}</time>
                </article>
              ))
            )}
          </div>

          <form
            className="prompt-form"
            onSubmit={(event) => {
              event.preventDefault()
              void onOrchestrate()
            }}
          >
            <label className="sr-only" htmlFor="agent-prompt">
              Instruct TalentPilot
            </label>
            <input
              id="agent-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask the Master Agent to scout, screen, schedule, or follow up…"
              disabled={busy}
            />
            <button
              className="btn btn--primary"
              type="submit"
              disabled={busy || !prompt.trim()}
            >
              <Sparkles size={15} />
              {busy ? 'Working…' : 'Run'}
            </button>
          </form>
        </motion.div>

        <motion.aside
          className="workspace-panel glass-panel task-rail"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
        >
          <header className="panel-head">
            <h2>Overnight queue</h2>
          </header>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="task-list__meta">
                  <span className="mode-chip">{modeLabel[task.mode]}</span>
                  <span className={`status status--${task.status}`}>{task.status}</span>
                </div>
                <strong>{task.title}</strong>
                <p>{task.detail}</p>
              </li>
            ))}
          </ul>
        </motion.aside>
      </section>
    </AppShell>
  )
}
