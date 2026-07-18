"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-subtext">
          Workspace preferences (UI only — wire to backend later)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Display name for hiring workspace</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-subtext" htmlFor="org">
              Company name
            </label>
            <Input id="org" defaultValue="Acme Talent Labs" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-subtext" htmlFor="budget">
              Default monthly budget
            </label>
            <Input id="budget" defaultValue="1500" type="number" />
          </div>
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent configuration</CardTitle>
          <CardDescription>
            Mock toggles — connect to real agent config API later
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {[
            "Master Agent",
            "Matching",
            "Skill Gap",
            "Salary Analysis",
            "Schedule",
          ].map((a) => (
            <Badge
              key={a}
              className="border-primary/30 bg-primary/10 text-primary"
            >
              {a} · Enabled
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
