import type { Candidate } from '../types/recruitment'
import { formatPercent, titleCaseStatus } from '../lib/format'
import { matchTone } from '../utils/matchTone'

type Props = {
  candidate: Candidate
  active: boolean
  onSelect: (id: string) => void
}

export function CandidateCard({ candidate, active, onSelect }: Props) {
  const tone = matchTone(candidate.matchScore)

  return (
    <button
      type="button"
      className={`candidate-card${active ? ' is-active' : ''}`}
      onClick={() => onSelect(candidate.id)}
      aria-pressed={active}
    >
      <div className="candidate-card__top">
        <strong>{candidate.name}</strong>
        <span className={`match-pill match-pill--${tone}`}>
          {formatPercent(candidate.matchScore)}
        </span>
      </div>
      <p>{candidate.role}</p>
      <div className="candidate-card__meta">
        <span>{candidate.location}</span>
        <span>{titleCaseStatus(candidate.status)}</span>
      </div>
    </button>
  )
}
