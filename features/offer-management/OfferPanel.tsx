"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailComposer } from "@/components/ui/email-composer";
import { generateOffer, getOffers } from "@/services/automation";
import { notify } from "@/services/notifications";
import type { OfferLetter } from "@/types/automation";

export function OfferPanel() {
  const [offers, setOffers] = useState<OfferLetter[]>([]);
  const [selected, setSelected] = useState<OfferLetter | null>(null);
  const [name, setName] = useState("Emily Johnson");
  const [role, setRole] = useState("Junior Frontend Developer");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getOffers().then((res) => {
      if (res.success) {
        setOffers(res.data);
        setSelected(res.data[0] ?? null);
      }
      setLoading(false);
    });
  }, []);

  const onGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateOffer(name, role);
      if (res.success) {
        setOffers((prev) => [res.data, ...prev]);
        setSelected(res.data);
      }
    } finally {
      setGenerating(false);
    }
  };

  const approveSend = () => {
    if (!selected) return;
    const next = { ...selected, status: "Sent" as const };
    setSelected(next);
    setOffers((prev) => prev.map((o) => (o.id === next.id ? next : o)));
    notify.offerSent(next.candidateName);
  };

  if (loading) return <Skeleton className="h-80 rounded-[24px]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Card hover={false}>
          <CardHeader>
            <CardTitle className="text-base">Approve Candidate</CardTitle>
            <CardDescription>Offer Letter Agent drafts the pack</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
            <Button onClick={onGenerate} disabled={generating} className="w-full">
              <Sparkles className="h-4 w-4" />
              {generating ? "Generating…" : "Generate Offer"}
            </Button>
          </div>
        </Card>
        {offers.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setSelected(o)}
            className={`glass w-full rounded-2xl px-3 py-3 text-left ${
              selected?.id === o.id ? "ring-1 ring-primary/40" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{o.candidateName}</span>
            </div>
            <Badge className="mt-2 border-white/10 bg-white/5">{o.status}</Badge>
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                  Offer — {selected.candidateName}
                </h2>
                <p className="text-sm text-subtext">{selected.role}</p>
              </div>
              <Button onClick={approveSend}>
                <Send className="h-4 w-4" />
                Approve & Send
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-subtext">Salary summary</p>
                <p className="mt-1 text-sm">{selected.salarySummary}</p>
              </div>
              <div>
                <p className="text-xs text-subtext">Joining date</p>
                <p className="mt-1 text-sm">{selected.joiningDate}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-subtext">{selected.companyIntro}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-secondary">Benefits</p>
                <ul className="space-y-1 text-sm text-subtext">
                  {selected.benefits.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-secondary">Onboarding</p>
                <ul className="space-y-1 text-sm text-subtext">
                  {selected.onboarding.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <div>
            <p className="mb-2 text-sm font-medium">Email preview</p>
            <EmailComposer
              subject={`Offer of Employment — ${selected.role}`}
              body={selected.letterBody}
              status={selected.status === "Sent" ? "Sent" : "Pending"}
            />
          </div>

          <Card hover={false} className="bg-surface/30">
            <p className="text-xs text-subtext">PDF preview (text)</p>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-subtext">
              {`OFFER LETTER\n\n${selected.candidateName}\n${selected.role}\nJoining: ${selected.joiningDate}\n\n${selected.letterBody}`}
            </pre>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
