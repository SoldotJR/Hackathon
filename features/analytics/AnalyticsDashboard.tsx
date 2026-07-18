"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsData } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#22C55E", "#06B6D4", "#F59E0B", "#4F46E5", "#EF4444"];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
};

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AnalyticsCard({
  title,
  description,
  children,
}: AnalyticsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <div className="h-[260px] w-full">{children}</div>
    </Card>
  );
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AnalyticsCard
        title="Candidate Distribution"
        description="By recommendation tier"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.candidateDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.candidateDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      <AnalyticsCard title="Skill Match" description="Average scores across pool">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.skillMatch}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="skill"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      <AnalyticsCard
        title="Experience Distribution"
        description="Years of experience in candidate pool"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.experienceDistribution}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#06B6D4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      <AnalyticsCard
        title="Salary Distribution"
        description="Monthly expectation bands"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.salaryDistribution}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#22C55E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      <AnalyticsCard
        title="Recruitment Timeline"
        description="Estimated days per stage"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.recruitmentTimeline}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="stage"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="days"
              stroke="#A5B4FC"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>
    </div>
  );
}
