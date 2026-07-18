"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Copy,
  Check,
  Users,
  Target,
  Percent,
  DollarSign,
} from "lucide-react";
import { HubTabs } from "@/components/ui/hub-tabs";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { RecommendationPanel } from "@/features/recruitment/RecommendationPanel";
import { SalaryCard } from "@/features/recruitment/SalaryCard";
import { SkillRadar } from "@/features/recruitment/SkillRadar";
import { AnalyticsDashboard } from "@/features/analytics/AnalyticsDashboard";
import {
  getHiringRecommendations,
  getSalaryAnalyses,
  getSkillGap,
  getRecruitmentSummary,
} from "@/services/reports";
import { getAnalytics } from "@/services/analytics";
import { reportDownloadUrl } from "@/services/recruitment";
import { notify } from "@/services/notifications";
import type {
  HiringRecommendation,
  SalaryAnalysis,
  SkillGapData,
  RecruitmentSummary,
  AnalyticsData,
} from "@/types";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "export", label: "Export Center" },
];

const EXPORT_TYPES = [
  "Candidate Reports",
  "Recruitment Reports",
  "Interview Reports",
  "Hiring Summary",
  "Automation Logs",
  "Analytics Dashboard",
];

export function ReportsAnalyticsHub() {
  const search = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") || "overview");
  const [recs, setRecs] = useState<HiringRecommendation[]>([]);
  const [salaries, setSalaries] = useState<SalaryAnalysis[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null);
  const [summary, setSummary] = useState<RecruitmentSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportType, setExportType] = useState(EXPORT_TYPES[0]);
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-07-18");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = search.get("tab");
    if (t) setTab(t);
  }, [search]);

  useEffect(() => {
    Promise.all([
      getHiringRecommendations(),
      getSalaryAnalyses(),
      getSkillGap(),
      getRecruitmentSummary(),
      getAnalytics(),
    ]).then(([r, s, g, sum, a]) => {
      if (r.success) setRecs(r.data);
      if (s.success) setSalaries(s.data);
      if (g.success) setSkillGap(g.data);
      if (sum.success) setSummary(sum.data);
      if (a.success) setAnalytics(a.data);
      setLoading(false);
    });
  }, []);

  const summaryText = summary
    ? `TalentPilot Hiring Summary (${from} → ${to})\nPosition: ${summary.position}\nCandidates: ${summary.candidates}\nTop matches: ${summary.topMatches}\nAvg match: ${summary.averageMatch}%\nBudget: $${summary.budget}/mo`
    : "No summary available";

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    notify.success("Summary copied", "Hiring summary copied to clipboard.", {
      category: "system",
      skipCenter: true,
    });
  };

  const downloadCsv = () => {
    const rows = [
      ["Name", "Level", "Risk"],
      ...recs.map((r) => [r.candidateName, r.level, r.riskLevel]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talentpilot-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify.reportExported("CSV");
  };

  const downloadExcelish = () => {
    const rows = [
      ["Candidate", "Recommendation", "Risk"],
      ...recs.map((r) => [r.candidateName, r.level, r.riskLevel]),
    ];
    const tsv = rows.map((r) => r.join("\t")).join("\n");
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talentpilot-report.xls";
    a.click();
    URL.revokeObjectURL(url);
    notify.reportExported("Excel");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-subtext">
          KPIs, charts, recommendations, and multi-format export
        </p>
      </div>

      <HubTabs tabs={TABS} active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {tab === "overview" &&
            (loading ? (
              <Skeleton className="h-96 rounded-[24px]" />
            ) : (
              <>
                {summary && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Candidates" value={summary.candidates} icon={Users} />
                    <SummaryCard label="Top Matches" value={summary.topMatches} icon={Target} delay={0.05} />
                    <SummaryCard label="Avg Match" value={summary.averageMatch} suffix="%" icon={Percent} delay={0.1} />
                    <SummaryCard label="Budget" value={summary.budget} prefix="$" icon={DollarSign} delay={0.15} />
                  </div>
                )}
                <RecommendationPanel recommendations={recs} />
                {skillGap && <SkillRadar data={skillGap} />}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {salaries.map((a, i) => (
                    <SalaryCard key={a.candidateId} analysis={a} index={i} />
                  ))}
                </div>
              </>
            ))}

          {tab === "analytics" &&
            (analytics ? (
              <AnalyticsDashboard data={analytics} />
            ) : (
              <Skeleton className="h-96 rounded-[24px]" />
            ))}

          {tab === "export" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Export Center</CardTitle>
                  <CardDescription>
                    Choose report type and date range, then preview before download
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-subtext">Report type</label>
                    <select
                      className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
                      value={exportType}
                      onChange={(e) => setExportType(e.target.value)}
                    >
                      {EXPORT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-subtext">From</label>
                      <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-subtext">To</label>
                      <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setPreviewOpen(true)}>
                    Preview Report
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick export</CardTitle>
                  <CardDescription>Skip preview and download immediately</CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(reportDownloadUrl("pdf"), "_blank");
                      notify.reportExported("PDF");
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={downloadExcelish}>
                    <FileSpreadsheet className="h-4 w-4" />
                    Export Excel
                  </Button>
                  <Button variant="outline" onClick={downloadCsv}>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" onClick={copySummary}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy Summary"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Report Preview"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-surface/40 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-sm font-bold text-primary">
                TP
              </div>
              <div>
                <p className="font-semibold">{exportType}</p>
                <p className="text-xs text-subtext">
                  TalentPilot Labs · Generated {new Date().toLocaleDateString()} ·{" "}
                  {from} → {to}
                </p>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-subtext">{summaryText}</pre>
            {summary && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <p>Candidates: {summary.candidates}</p>
                <p>Top: {summary.topMatches}</p>
                <p>Avg: {summary.averageMatch}%</p>
                <p>Budget: ${summary.budget}</p>
              </div>
            )}
            <p className="mt-3 text-xs text-subtext">
              Recommendations: {recs.slice(0, 3).map((r) => r.candidateName).join(", ")}
              {recs.length > 3 ? "…" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                window.open(reportDownloadUrl("pdf"), "_blank");
                notify.reportExported("PDF");
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await copySummary();
              }}
            >
              <Copy className="h-4 w-4" />
              Share Summary
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
