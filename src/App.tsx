import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './stores/userStore'
import { Layout } from './components/Layout'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { LogNew } from './pages/LogNew'
import { ActiveSession } from './pages/ActiveSession'
import { SessionDetail } from './pages/SessionDetail'
import { Programs } from './pages/Programs'
import { ProgramDetail } from './pages/ProgramDetail'
import { ProgramNew } from './pages/ProgramNew'
import { ProgramEdit } from './pages/ProgramEdit'
import { Progress } from './pages/Progress'
import { ExerciseProgress } from './pages/ExerciseProgress'
import { Settings } from './pages/Settings'
import { useEffect } from 'react'

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export function App() {
  const theme = useUserStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [theme])

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <OnboardingGuard>
            <Layout />
          </OnboardingGuard>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/log/new" element={<LogNew />} />
        <Route path="/log/:sessionId" element={<ActiveSession />} />
        <Route path="/session/:sessionId" element={<SessionDetail />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/new" element={<ProgramNew />} />
        <Route path="/programs/:programId" element={<ProgramDetail />} />
        <Route path="/programs/:programId/edit" element={<ProgramEdit />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/progress/:exerciseId" element={<ExerciseProgress />} />
        <Route path="/settings" element={<Settings />} />
        {/* Legacy redirects from removed plan routes */}
        <Route path="/plans" element={<Navigate to="/programs" replace />} />
        <Route path="/plans/*" element={<Navigate to="/programs" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
