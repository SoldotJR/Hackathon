import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { listEvaluations } from '../../services/automation/evaluation'
import type { EvaluationDraft } from '../../types/automation'

export function EvaluationPage() {
  const [items, setItems] = useState<EvaluationDraft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void listEvaluations().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  return (
    <AppShell title="Interview Evaluation">
      <PageHeader
        eyebrow="Automation"
        title="Interview Evaluation Agent"
        description="Auto-generated scorecards after interviews — strengths, risks, and a clear recommendation."
      />

      {loading ? (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} /> Loading evaluations…
        </p>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <article key={item.id} className="glass-panel">
              <div className="stack-item__top">
                <h2>{item.candidateName}</h2>
                <StatusBadge status={item.recommendation} />
              </div>
              <p className="muted-line">{item.role}</p>
              <p className="score-line">{item.score}/100</p>
              <p>{item.summary}</p>
              <div className="chip-row">
                {item.strengths.map((strength) => (
                  <span key={strength} className="soft-chip">
                    {strength}
                  </span>
                ))}
              </div>
              <div className="chip-row">
                {item.risks.map((risk) => (
                  <span key={risk} className="soft-chip soft-chip--warn">
                    {risk}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  )
}
