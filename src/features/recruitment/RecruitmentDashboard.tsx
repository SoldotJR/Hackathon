import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AppShell } from '../../components/AppShell'
import { CandidateCard } from '../../components/CandidateCard'
import { PageHeader } from '../../components/PageHeader'
import { SkillRadar } from '../../components/SkillRadar'
import { useRecruitment } from '../../hooks/useRecruitment'
import { formatPercent, titleCaseStatus } from '../../lib/format'

export function RecruitmentDashboard() {
  const {
    snapshot,
    selected,
    selectedId,
    setSelectedId,
    loading,
    error,
    advanceSelected,
  } = useRecruitment()

  return (
    <AppShell title="Recruitment">
      <PageHeader
        eyebrow="Recruitment intelligence"
        title="See who is ready, ranked, and next in line."
        description="Live pipeline view powered by TalentPilot screening — mock service layer ready to swap for a backend."
      />

      {loading && (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} aria-hidden="true" /> Loading pipeline…
        </p>
      )}
      {error && <p className="state-line state-line--error">{error}</p>}

      {snapshot && (
        <>
          <section className="metric-strip" aria-label="Recruitment metrics">
            <div className="glass-panel">
              <span>Candidates</span>
              <strong>{snapshot.candidates.length}</strong>
            </div>
            <div className="glass-panel">
              <span>Screened today</span>
              <strong>{snapshot.screenedToday}</strong>
            </div>
            <div className="glass-panel">
              <span>Avg match</span>
              <strong>{formatPercent(snapshot.averageMatch)}</strong>
            </div>
          </section>

          <section className="recruitment-grid">
            <div className="candidate-column">
              <h2>Pipeline</h2>
              <div className="candidate-list">
                {snapshot.candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    active={candidate.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            </div>

            <div className="detail-column">
              {selected && (
                <motion.article
                  key={selected.id}
                  className="candidate-detail glass-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <header>
                    <div>
                      <h2>{selected.name}</h2>
                      <p>
                        {selected.role} · {selected.location}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => void advanceSelected()}
                      disabled={selected.status === 'hired' || selected.status === 'rejected'}
                    >
                      Advance stage
                    </button>
                  </header>

                  <p className="summary">{selected.summary}</p>
                  <dl className="detail-facts">
                    <div>
                      <dt>Match</dt>
                      <dd>{formatPercent(selected.matchScore)}</dd>
                    </div>
                    <div>
                      <dt>Experience</dt>
                      <dd>{selected.experienceYears} yrs</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{titleCaseStatus(selected.status)}</dd>
                    </div>
                  </dl>

                  <SkillRadar skills={selected.skills} />
                </motion.article>
              )}

              <div className="charts-row">
                <div className="chart-block glass-panel">
                  <h3>Stage volume</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={snapshot.pipeline}>
                      <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                      <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-block glass-panel">
                  <h3>Role demand</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={snapshot.roleDemand}>
                      <CartesianGrid stroke="rgba(15, 23, 42, 0.08)" vertical={false} />
                      <XAxis dataKey="role" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip />
                      <Bar dataKey="applicants" fill="#0ea5a4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </AppShell>
  )
}
