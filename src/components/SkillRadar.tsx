import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { SkillScore } from '../types/recruitment'

type Props = {
  skills: SkillScore[]
}

export function SkillRadar({ skills }: Props) {
  return (
    <div className="skill-radar" aria-label="Skill radar chart">
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={skills} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(15, 118, 110, 0.18)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#0f766e"
            fill="#0f766e"
            fillOpacity={0.28}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
