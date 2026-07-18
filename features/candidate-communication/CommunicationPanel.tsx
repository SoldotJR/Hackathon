"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  ScanSearch,
  Mail,
  Bell,
  Scale,
  FileSignature,
  Bot,
  UserRound,
  CheckCircle2,
  Clock,
  ChevronDown,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SummaryCard } from "@/components/ui/summary-card";
import { EmailComposer } from "@/components/ui/email-composer";
import { SimpleTimeline } from "@/components/ui/simple-timeline";
import { notify } from "@/services/notifications";
import { cn } from "@/utils/cn";

type StageStatus = "completed" | "waiting" | "active" | "locked";

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  tone: "success" | "scheduled" | "pending" | "default";
}

const ACK_EMAIL = `Thank you for submitting your application.

We have successfully received your CV.

Our recruitment team is currently reviewing your profile.

We will contact you regarding the next steps.`;

const REJECT_EMAIL = `Thank you for taking the time to interview with us.

We appreciate your interest.

Although we will not be moving forward at this time, we were impressed by your experience and encourage you to apply for future opportunities.`;

const OFFER_EMAIL = `Dear Emily,

We are delighted to offer you the Junior Frontend Developer role at TalentPilot Labs.

Joining date: August 4, 2026.

A secure offer pack with compensation details will follow. Welcome aboard.

Warm regards,
People Team`;

const INVITE_EMAIL = `Dear Emily,

We would like to invite you to a 45-minute interview for the Junior Frontend Developer role.

Proposed time: Saturday, Jul 19 · 10:00 AM (UTC+6:30)
Meet link: https://meet.google.com/abc-defg-hij

Please reply if you need to reschedule.

Best regards,
Talent Acquisition`;

function StatusChip({
  kind,
}: {
  kind: "ai" | "human" | "done" | "waiting" | "sent" | "scheduled";
}) {
  const map = {
    ai: { label: "AI Automatic", className: "border-accent/30 bg-accent/10 text-accent", Icon: Bot },
    human: {
      label: "Human Approval",
      className: "border-secondary/40 bg-secondary/10 text-secondary",
      Icon: UserRound,
    },
    done: {
      label: "Completed",
      className: "border-accent/30 bg-accent/10 text-accent",
      Icon: CheckCircle2,
    },
    waiting: {
      label: "Waiting",
      className: "border-warning/30 bg-warning/10 text-warning",
      Icon: Clock,
    },
    sent: {
      label: "Email Sent",
      className: "border-primary/30 bg-primary/10 text-primary",
      Icon: Mail,
    },
    scheduled: {
      label: "Scheduled",
      className: "border-secondary/30 bg-secondary/10 text-secondary",
      Icon: Clock,
    },
  } as const;
  const item = map[kind];
  const Icon = item.Icon;
  return (
    <Badge className={cn("gap-1", item.className)}>
      <Icon className="h-3 w-3" />
      {item.label}
    </Badge>
  );
}

export function CommunicationPanel() {
  const [invited, setInvited] = useState(false);
  const [decision, setDecision] = useState<"none" | "pass" | "reject">("none");
  const [offerApproved, setOfferApproved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("cv");
  const [busy, setBusy] = useState<string | null>(null);

  const stageStatus = useMemo(() => {
    const s: Record<string, StageStatus> = {
      cv: "completed",
      screening: "completed",
      invite: invited ? "completed" : "active",
      reminder: invited ? "completed" : "locked",
      result: invited ? (decision === "none" ? "active" : "completed") : "locked",
      offer: decision === "pass" ? "completed" : decision === "reject" ? "completed" : "locked",
    };
    return s;
  }, [invited, decision]);

  const kpis = {
    emails:
      1 + // ack
      (invited ? 1 : 0) +
      (decision === "reject" ? 1 : 0) +
      (offerApproved ? 1 : 0),
    pendingInterviews: invited && decision === "none" ? 1 : 0,
    waiting: !invited ? 1 : decision === "none" && invited ? 1 : 0,
    offers: offerApproved ? 1 : decision === "pass" ? 1 : 0,
  };

  const activity: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [
      {
        id: "a1",
        time: "09:12",
        title: "CV Received",
        description: "Emily Johnson submitted application",
        tone: "success",
      },
      {
        id: "a2",
        time: "09:12",
        title: "Acknowledgement Email Sent",
        description: "Candidate Communication Agent",
        tone: "success",
      },
      {
        id: "a3",
        time: "09:18",
        title: "Resume Screened",
        description: "Resume Screening Agent",
        tone: "success",
      },
      {
        id: "a4",
        time: "09:20",
        title: "Candidate Ranked",
        description: "Match score 96% · Highly Recommended",
        tone: "success",
      },
    ];
    if (invited) {
      items.push(
        {
          id: "a5",
          time: "11:10",
          title: "Interview Invitation Sent",
          description: "Scheduled · Meet link created",
          tone: "success",
        },
        {
          id: "a6",
          time: "Tomorrow",
          title: "Reminder Scheduled",
          description: "24h · 1h · 10 minutes",
          tone: "scheduled",
        }
      );
    }
    if (decision === "pass") {
      items.push({
        id: "a7",
        time: "After Interview",
        title: "Offer Letter Generated",
        description: offerApproved ? "Approved & sent" : "Awaiting Approve & Send",
        tone: offerApproved ? "success" : "pending",
      });
    }
    if (decision === "reject") {
      items.push({
        id: "a8",
        time: "After Interview",
        title: "Rejection Email Sent",
        description: "Empathetic close-out message",
        tone: "success",
      });
    }
    return items;
  }, [invited, decision, offerApproved]);

  const runAction = async (key: string, fn: () => void) => {
    setBusy(key);
    await new Promise((r) => setTimeout(r, 700));
    fn();
    setBusy(null);
    if (key === "invite") {
      notify.interviewScheduled("Emily Johnson");
      notify.reminderScheduled("tomorrow at 9:00 AM");
    } else if (key === "reject") {
      notify.candidateRejected("Emily Johnson");
    } else if (key === "offer") {
      notify.offerSent("Emily Johnson");
    }
  };

  const toggle = (id: string) =>
    setExpanded((cur) => (cur === id ? null : id));

  return (
    <div className="space-y-8">
      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Emails Automated" value={kpis.emails} icon={Mail} />
        <SummaryCard
          label="Pending Interviews"
          value={kpis.pendingInterviews}
          icon={Clock}
          delay={0.05}
        />
        <SummaryCard
          label="Candidates Waiting"
          value={kpis.waiting}
          icon={UserRound}
          delay={0.1}
        />
        <SummaryCard
          label="Offers Sent"
          value={kpis.offers}
          icon={FileSignature}
          delay={0.15}
        />
      </div>

      <p className="text-sm text-subtext">
        Candidate: <span className="font-medium text-text">Emily Johnson</span>
        {" · "}
        You only need to <strong className="text-text">Invite</strong>, then{" "}
        <strong className="text-text">PASS</strong> or{" "}
        <strong className="text-text">REJECT</strong>. Everything else is automatic.
      </p>

      {/* Workflow stages */}
      <div className="relative space-y-4 border-l border-white/10 pl-6 sm:pl-8">
        <StageCard
          step={1}
          icon={FileText}
          title="CV Received"
          status={stageStatus.cv}
          badges={
            <>
              <StatusChip kind="ai" />
              <StatusChip kind="sent" />
              <StatusChip kind="done" />
            </>
          }
          agent="Candidate Communication Agent"
          description="Automatically thanked the candidate and confirmed CV receipt."
          timestamp="Today · 09:12"
          expanded={expanded === "cv"}
          onToggle={() => toggle("cv")}
        >
          <EmailComposer
            subject="We received your application — TalentPilot Labs"
            body={ACK_EMAIL}
            status="Sent"
            editable={false}
          />
          <p className="mt-3 text-xs text-subtext">
            Communication history: Acknowledgement auto-sent · No recruiter action needed
          </p>
        </StageCard>

        <StageCard
          step={2}
          icon={ScanSearch}
          title="Resume Screening"
          status={stageStatus.screening}
          badges={
            <>
              <StatusChip kind="ai" />
              <StatusChip kind="done" />
            </>
          }
          agent="Resume Screening Agent"
          description="Profile screened and ranked automatically. No user interaction."
          timestamp="Today · 09:18"
          expanded={expanded === "screening"}
          onToggle={() => toggle("screening")}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Match Score" value="96%" />
            <Metric label="Ranking" value="#1" />
            <Metric label="Recommendation" value="Highly Recommended" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["React", "TypeScript", "Tailwind CSS", "Next.js"].map((s) => (
              <Badge key={s} className="border-white/10 bg-white/5 text-subtext">
                {s}
              </Badge>
            ))}
          </div>
        </StageCard>

        <StageCard
          step={3}
          icon={Mail}
          title="Interview Invitation"
          status={stageStatus.invite}
          badges={
            invited ? (
              <>
                <StatusChip kind="human" />
                <StatusChip kind="ai" />
                <StatusChip kind="sent" />
              </>
            ) : (
              <>
                <StatusChip kind="human" />
                <StatusChip kind="waiting" />
              </>
            )
          }
          agent="Communication + Scheduling Agents"
          description={
            invited
              ? "Invitation generated, interview scheduled, Meet link created, email sent."
              : "Waiting for recruiter approval to invite this candidate."
          }
          timestamp={invited ? "Today · 11:10" : "Awaiting action"}
          expanded={expanded === "invite"}
          onToggle={() => toggle("invite")}
          action={
            !invited ? (
              <Button
                onClick={() =>
                  runAction("invite", () => {
                    setInvited(true);
                    setExpanded("invite");
                  })
                }
                disabled={busy === "invite"}
              >
                <Send className="h-4 w-4" />
                {busy === "invite" ? "AI sending…" : "Invite Candidate"}
              </Button>
            ) : undefined
          }
        >
          {invited && (
            <EmailComposer
              subject="Interview Invitation — Junior Frontend Developer"
              body={INVITE_EMAIL}
              status="Sent"
              editable={false}
            />
          )}
        </StageCard>

        <StageCard
          step={4}
          icon={Bell}
          title="Interview Reminder"
          status={stageStatus.reminder}
          badges={
            invited ? (
              <>
                <StatusChip kind="ai" />
                <StatusChip kind="scheduled" />
              </>
            ) : (
              <StatusChip kind="waiting" />
            )
          }
          agent="Reminder Agent"
          description={
            invited
              ? "Reminders queued for 24 hours, 1 hour, and 10 minutes before the interview."
              : "Unlocks after invitation is sent."
          }
          timestamp={invited ? "Tomorrow" : "—"}
          expanded={expanded === "reminder"}
          onToggle={() => toggle("reminder")}
          disabled={!invited}
        >
          <SimpleTimeline
            items={[
              {
                id: "r1",
                time: "24 hours",
                title: "Email reminder",
                description: "Delivery: Scheduled",
                tone: "scheduled",
              },
              {
                id: "r2",
                time: "1 hour",
                title: "Email reminder",
                description: "Delivery: Upcoming",
                tone: "pending",
              },
              {
                id: "r3",
                time: "10 minutes",
                title: "In-app reminder",
                description: "Delivery: Upcoming",
                tone: "pending",
              },
            ]}
          />
        </StageCard>

        <StageCard
          step={5}
          icon={Scale}
          title="Interview Result"
          status={stageStatus.result}
          badges={
            decision === "none" ? (
              <>
                <StatusChip kind="human" />
                <StatusChip kind="waiting" />
              </>
            ) : (
              <>
                <StatusChip kind="human" />
                <StatusChip kind="done" />
              </>
            )
          }
          agent="HR Final Decision"
          description={
            decision === "none"
              ? "One click only — PASS or REJECT. No typing required."
              : decision === "pass"
                ? "You selected PASS. Offer automation started."
                : "You selected REJECT. Empathetic rejection email sent."
          }
          timestamp={decision === "none" ? "After interview" : "Just now"}
          expanded={expanded === "result"}
          onToggle={() => toggle("result")}
          disabled={!invited}
          action={
            invited && decision === "none" ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    runAction("pass", () => {
                      setDecision("pass");
                      setExpanded("offer");
                    })
                  }
                  disabled={!!busy}
                  className="bg-accent text-background hover:bg-accent/90"
                >
                  {busy === "pass" ? "Processing…" : "PASS"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    runAction("reject", () => {
                      setDecision("reject");
                      setExpanded("offer");
                    })
                  }
                  disabled={!!busy}
                  className="border-danger/40 text-danger hover:bg-danger/10"
                >
                  {busy === "reject" ? "Sending…" : "REJECT"}
                </Button>
              </div>
            ) : undefined
          }
        >
          {decision === "pass" && (
            <p className="text-sm text-accent">Decision recorded: PASS</p>
          )}
          {decision === "reject" && (
            <p className="text-sm text-danger">Decision recorded: REJECT</p>
          )}
        </StageCard>

        <StageCard
          step={6}
          icon={FileSignature}
          title={decision === "reject" ? "Rejection Email" : "Offer & Welcome"}
          status={stageStatus.offer}
          badges={
            decision === "pass" ? (
              <>
                <StatusChip kind="ai" />
                {offerApproved ? <StatusChip kind="sent" /> : <StatusChip kind="waiting" />}
              </>
            ) : decision === "reject" ? (
              <>
                <StatusChip kind="ai" />
                <StatusChip kind="sent" />
              </>
            ) : (
              <StatusChip kind="waiting" />
            )
          }
          agent={
            decision === "reject" ? "Candidate Communication Agent" : "Offer Letter Agent"
          }
          description={
            decision === "pass"
              ? "Offer letter, welcome email, and joining instructions generated."
              : decision === "reject"
                ? "Professional rejection email sent automatically."
                : "Appears after PASS or REJECT."
          }
          timestamp={decision === "none" ? "—" : "After decision"}
          expanded={expanded === "offer"}
          onToggle={() => toggle("offer")}
          disabled={decision === "none"}
          action={
            decision === "pass" && !offerApproved ? (
              <Button
                onClick={() =>
                  runAction("offer", () => setOfferApproved(true))
                }
                disabled={busy === "offer"}
              >
                <Send className="h-4 w-4" />
                {busy === "offer" ? "Sending…" : "Approve & Send"}
              </Button>
            ) : undefined
          }
        >
          {decision === "pass" && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm text-subtext sm:grid-cols-3">
                <p>✓ Offer Letter</p>
                <p>✓ Welcome Email</p>
                <p>✓ Joining Instructions</p>
              </div>
              <EmailComposer
                subject="Offer of Employment — Junior Frontend Developer"
                body={OFFER_EMAIL}
                status={offerApproved ? "Sent" : "Pending"}
                editable={false}
              />
            </div>
          )}
          {decision === "reject" && (
            <EmailComposer
              subject="Update on your application"
              body={REJECT_EMAIL}
              status="Sent"
              editable={false}
            />
          )}
        </StageCard>
      </div>

      {/* Activity */}
      <div className="glass rounded-[24px] p-6">
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
          Activity Timeline
        </h2>
        <p className="mt-1 mb-6 text-sm text-subtext">
          Every autonomous action in this hiring thread
        </p>
        <SimpleTimeline
          items={activity.map((a) => ({
            id: a.id,
            time: a.time,
            title: a.title,
            description: a.description,
            tone: a.tone,
          }))}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface/50 px-4 py-3">
      <p className="text-xs text-subtext">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-syne)] text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

function StageCard({
  step,
  icon: Icon,
  title,
  status,
  badges,
  agent,
  description,
  timestamp,
  expanded,
  onToggle,
  action,
  children,
  disabled,
}: {
  step: number;
  icon: ComponentType<{ className?: string }>;
  title: string;
  status: StageStatus;
  badges: ReactNode;
  agent: string;
  description: string;
  timestamp: string;
  expanded: boolean;
  onToggle: () => void;
  action?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: disabled ? 0.45 : 1, y: 0 }}
      className="relative"
    >
      <span
        className={cn(
          "absolute -left-[31px] top-6 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-background sm:-left-[39px]",
          status === "completed" && "bg-accent text-background",
          status === "active" && "bg-primary text-white",
          status === "waiting" && "bg-warning text-background",
          status === "locked" && "bg-surface text-subtext"
        )}
      >
        {step}
      </span>

      <div
        className={cn(
          "glass rounded-[24px] p-5 transition",
          status === "active" && "ring-1 ring-primary/35",
          status === "completed" && "ring-1 ring-accent/20"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
            disabled={disabled}
          >
            <div className="rounded-2xl bg-primary/15 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                  {title}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-subtext transition",
                    expanded && "rotate-180"
                  )}
                />
              </div>
              <p className="mt-1 text-xs text-subtext">{agent}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{badges}</div>
              <p className="mt-3 text-sm text-subtext">{description}</p>
              <p className="mt-2 text-xs text-secondary">{timestamp}</p>
            </div>
          </button>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        <AnimatePresence initial={false}>
          {expanded && children && !disabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-white/10 pt-5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
