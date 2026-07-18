import { useEffect, useState } from 'react'
import { advanceCandidate, getRecruitmentSnapshot } from '../services/recruitment'
import type { RecruitmentSnapshot } from '../types/recruitment'
import { selectCandidate } from '../store/recruitmentStore'

export function useRecruitment() {
  const [snapshot, setSnapshot] = useState<RecruitmentSnapshot | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getRecruitmentSnapshot()
      .then((data) => {
        if (!alive) return
        setSnapshot(data)
        setSelectedId(data.candidates[0]?.id ?? null)
        setError(null)
      })
      .catch(() => {
        if (!alive) return
        setError('Could not load recruitment data.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const selected = selectCandidate(snapshot?.candidates ?? [], selectedId)

  async function advanceSelected() {
    if (!selected) return
    const updated = await advanceCandidate(selected.id)
    if (!updated || !snapshot) return
    setSnapshot({
      ...snapshot,
      candidates: snapshot.candidates.map((c) => (c.id === updated.id ? updated : c)),
    })
  }

  return {
    snapshot,
    selected,
    selectedId,
    setSelectedId,
    loading,
    error,
    advanceSelected,
  }
}
