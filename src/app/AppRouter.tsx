import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { RecruitmentDashboard } from '../features/recruitment/RecruitmentDashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/recruitment" element={<RecruitmentDashboard />} />
    </Routes>
  )
}
