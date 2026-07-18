import { motion } from 'framer-motion'
import { ArrowUpRight, Bot, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SiteNav } from './components/SiteNav'
import { brand } from './data/brand'
import { useAgentWorkspace } from './hooks/useAgentWorkspace'

const modeLabel = {
  scout: 'Scout',
  screen: 'Screen',
  helpdesk: 'Helpdesk',
  ops: 'Ops',
} as const

export default function App() {
  const { tasks, messages, prompt, setPrompt, busy, loading, submitPrompt } =
    useAgentWorkspace()

  return (
    <div className="agent-shell">
      <SiteNav />

      <section className="agent-hero">
        <div className="agent-hero__veil" aria-hidden="true" />
        <motion.div
          className="agent-hero__copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="brand-mark">{brand.name}</p>
          <h1>{brand.tagline}</h1>
          <p className="lede">{brand.pitch}</p>
          <div className="cta-row">
            <a className="btn btn--primary" href="#workspace">
              Open workspace
            </a>
            <Link className="btn btn--ghost" to="/recruitment">
              Recruitment intel
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="workspace" className="agent-workspace">
        <motion.div
          className="workspace-panel conversation"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <header className="panel-head">
            <Bot size={18} aria-hidden="true" />
            <h2>Agent console</h2>
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
                  <span>{message.role === 'agent' ? brand.name : 'You'}</span>
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
              void submitPrompt()
            }}
          >
            <label className="sr-only" htmlFor="agent-prompt">
              Instruct Meridian
            </label>
            <input
              id="agent-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask Meridian to scout, screen, or clear ops…"
              disabled={busy}
            />
            <button className="btn btn--primary" type="submit" disabled={busy || !prompt.trim()}>
              {busy ? 'Working…' : 'Send'}
            </button>
          </form>
        </motion.div>

        <motion.aside
          className="workspace-panel task-rail"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08 }}
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
    </div>
  )
}
