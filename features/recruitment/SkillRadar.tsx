"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { SkillGapData } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillRadarProps {
  data: SkillGapData;
}

export function SkillRadar({ data }: SkillRadarProps) {
  const chartData = data.labels.map((label, i) => ({
    skill: label,
    required: data.required[i],
    current: data.current[i],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
        <CardDescription>
          Current pool vs required competencies for this role
        </CardDescription>
      </CardHeader>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#6B7280", fontSize: 10 }}
            />
            <Radar
              name="Required"
              dataKey="required"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.25}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.3}
            />
            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {data.missing.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="mb-2 text-sm text-subtext">Missing Skills</p>
          <div className="flex flex-wrap gap-2">
            {data.missing.map((skill) => (
              <Badge
                key={skill}
                className="border-warning/30 bg-warning/10 text-warning"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
