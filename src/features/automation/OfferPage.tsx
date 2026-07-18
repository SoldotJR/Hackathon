import { LoaderCircle, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { listOffers, sendOffer } from '../../services/automation/offers'
import type { OfferDraft } from '../../types/automation'

export function OfferPage() {
  const [offers, setOffers] = useState<OfferDraft[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void listOffers().then((data) => {
      setOffers(data)
      setSelectedId(data[0]?.id ?? null)
      setLoading(false)
    })
  }, [])

  const selected = offers.find((item) => item.id === selectedId) ?? null

  async function onSend() {
    if (!selected) return
    const updated = await sendOffer(selected.id)
    if (!updated) return
    setOffers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }

  return (
    <AppShell title="Offer Management">
      <PageHeader
        eyebrow="Automation"
        title="Offer Letter Agent"
        description="Draft clear offer letters, review terms, and send when HR is ready."
      />

      {loading ? (
        <p className="state-line">
          <LoaderCircle className="spin" size={16} /> Loading offers…
        </p>
      ) : (
        <div className="auto-split auto-split--2">
          <section className="glass-panel">
            <h2>Offers</h2>
            <div className="stack-list">
              {offers.map((offer) => (
                <button
                  key={offer.id}
                  type="button"
                  className={`stack-item${offer.id === selectedId ? ' is-active' : ''}`}
                  onClick={() => setSelectedId(offer.id)}
                >
                  <div className="stack-item__top">
                    <strong>{offer.candidateName}</strong>
                    <StatusBadge status={offer.status} />
                  </div>
                  <p>
                    {offer.role} · {offer.salary}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-panel">
            {selected ? (
              <>
                <div className="editor-head">
                  <div>
                    <h2>{selected.candidateName}</h2>
                    <p className="muted-line">
                      {selected.role} · start {selected.startDate}
                    </p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <pre className="offer-body">{selected.body}</pre>
                {selected.status !== 'Sent' ? (
                  <button type="button" className="btn btn--primary" onClick={() => void onSend()}>
                    <Send size={15} /> Send offer
                  </button>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      )}
    </AppShell>
  )
}
