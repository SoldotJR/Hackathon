import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { CommunicationPage } from '../features/automation/CommunicationPage'
import { EvaluationPage } from '../features/automation/EvaluationPage'
import { FollowUpPage } from '../features/automation/FollowUpPage'
import { OfferPage } from '../features/automation/OfferPage'
import { SchedulingPage } from '../features/automation/SchedulingPage'
import { TimelinePage } from '../features/automation/TimelinePage'
import { RecruitmentDashboard } from '../features/recruitment/RecruitmentDashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/recruitment" element={<RecruitmentDashboard />} />
      <Route path="/automation/communication" element={<CommunicationPage />} />
      <Route path="/automation/scheduling" element={<SchedulingPage />} />
      <Route path="/automation/evaluation" element={<EvaluationPage />} />
      <Route path="/automation/follow-up" element={<FollowUpPage />} />
      <Route path="/automation/offers" element={<OfferPage />} />
      <Route path="/automation/timeline" element={<TimelinePage />} />
    </Routes>
  )
}
