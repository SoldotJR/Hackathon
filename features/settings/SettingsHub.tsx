"use client";

import { useState } from "react";
import { HubTabs } from "@/components/ui/hub-tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";

const TABS = [
  { id: "user", label: "User" },
  { id: "ai", label: "AI Settings" },
  { id: "company", label: "Company" },
  { id: "email", label: "Email Templates" },
  { id: "api", label: "API Keys" },
  { id: "preferences", label: "Preferences" },
];

export function SettingsHub() {
  const [tab, setTab] = useState("user");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-subtext">
          User, AI, company, templates, and workspace preferences
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
          className="space-y-4"
        >
          {tab === "user" && (
            <Card>
              <CardHeader>
                <CardTitle>User profile</CardTitle>
                <CardDescription>Your recruiter identity</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="name">
                    Display name
                  </label>
                  <Input id="name" defaultValue="Alex Rivera" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="email">
                    Email
                  </label>
                  <Input id="email" type="email" defaultValue="alex@talentpilot.ai" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="role">
                    Role
                  </label>
                  <Input id="role" defaultValue="Senior Recruiter" />
                </div>
                <Button>Save profile</Button>
              </div>
            </Card>
          )}

          {tab === "ai" && (
            <Card>
              <CardHeader>
                <CardTitle>AI agent configuration</CardTitle>
                <CardDescription>
                  Enable or tune autonomous agents (UI — wire to config API later)
                </CardDescription>
              </CardHeader>
              <div className="flex flex-wrap gap-2">
                {[
                  "Master Agent",
                  "Matching",
                  "Skill Gap",
                  "Salary Analysis",
                  "Schedule",
                  "Communication",
                  "Reminder",
                  "Follow-up",
                ].map((a) => (
                  <Badge
                    key={a}
                    className="border-primary/30 bg-primary/10 text-primary"
                  >
                    {a} · Enabled
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm text-subtext" htmlFor="temp">
                  Recommendation confidence threshold
                </label>
                <Input id="temp" type="number" defaultValue="75" min={0} max={100} />
              </div>
              <Button className="mt-4">Save AI settings</Button>
            </Card>
          )}

          {tab === "company" && (
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
                <CardDescription>Branding used in offers and reports</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="org">
                    Company name
                  </label>
                  <Input id="org" defaultValue="TalentPilot Labs" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="budget">
                    Default monthly budget
                  </label>
                  <Input id="budget" defaultValue="1500" type="number" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="logo">
                    Logo URL
                  </label>
                  <Input id="logo" defaultValue="https://talentpilot.ai/logo.svg" />
                </div>
                <Button>Save company</Button>
              </div>
            </Card>
          )}

          {tab === "email" && (
            <Card>
              <CardHeader>
                <CardTitle>Email templates</CardTitle>
                <CardDescription>
                  Defaults for invite, reminder, offer, and rejection
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                {[
                  { id: "invite", label: "Interview invitation", body: "Hi {{name}}, we'd love to invite you to interview for {{role}}…" },
                  { id: "reminder", label: "Interview reminder", body: "Reminder: your interview is scheduled for {{datetime}}." },
                  { id: "offer", label: "Offer letter intro", body: "Congratulations {{name}}! We're excited to extend an offer…" },
                ].map((t) => (
                  <div key={t.id}>
                    <label className="mb-1.5 block text-sm text-subtext" htmlFor={t.id}>
                      {t.label}
                    </label>
                    <Textarea id={t.id} defaultValue={t.body} rows={3} />
                  </div>
                ))}
                <Button>Save templates</Button>
              </div>
            </Card>
          )}

          {tab === "api" && (
            <Card>
              <CardHeader>
                <CardTitle>API keys</CardTitle>
                <CardDescription>Integrations for LLM and calendar (stored locally in UI)</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="gemini">
                    Gemini / Groq key
                  </label>
                  <Input id="gemini" type="password" placeholder="••••••••••••" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="calendar">
                    Calendar API key
                  </label>
                  <Input id="calendar" type="password" placeholder="••••••••••••" />
                </div>
                <Button>Save keys</Button>
              </div>
            </Card>
          )}

          {tab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Workspace defaults</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="tz">
                    Timezone
                  </label>
                  <Input id="tz" defaultValue="Asia/Yangon" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="lang">
                    Language
                  </label>
                  <Input id="lang" defaultValue="English" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-subtext" htmlFor="density">
                    UI density
                  </label>
                  <Input id="density" defaultValue="Comfortable" />
                </div>
                <Button>Save preferences</Button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
