import type { OfferDraft } from '../../types/automation'
import { mockOffers } from '../mock/automation'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listOffers(): Promise<OfferDraft[]> {
  await delay()
  return mockOffers.map((item) => ({ ...item }))
}

export async function sendOffer(id: string): Promise<OfferDraft | null> {
  await delay(220)
  const offer = mockOffers.find((item) => item.id === id)
  if (!offer) return null
  offer.status = 'Sent'
  return { ...offer }
}
