"use client";

import { OfferPanel } from "@/features/offer-management/OfferPanel";

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Offer Management
        </h1>
        <p className="mt-1 text-subtext">
          Generate offer letters, benefits, and onboarding after approval
        </p>
      </div>
      <OfferPanel />
    </div>
  );
}
