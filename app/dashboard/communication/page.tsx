"use client";

import { CommunicationPanel } from "@/features/candidate-communication/CommunicationPanel";

export default function CandidateCommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Candidate Communication
        </h1>
        <p className="mt-1 max-w-2xl text-subtext">
          AI handles outreach automatically. You only Invite, then PASS or REJECT.
        </p>
      </div>
      <CommunicationPanel />
    </div>
  );
}
