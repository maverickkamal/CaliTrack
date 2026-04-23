import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { useSessionStore } from '../stores/sessionStore'
import { useProgramStore } from '../stores/programStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { usePlanStore } from '../stores/planStore'
import { Coachmarks } from '../components/Coachmarks'
import { Play, Flame, TrendingUp, ChevronRight, Settings, RotateCcw } from 'lucide-react'
import { MOOD_MAP } from '../types'

function getStreak(sessions: { date: string }[], trainingDaysPerWeek: number): number {
  if (sessions.length === 0 || trainingDaysPerWeek === 0) return 0
  const restDays = 7 - trainingDaysPerWeek
  const daysBetween = Math.max(1, Math.floor(7 / trainingDaysPerWeek))

  const sessionDates = [...new Set(sessions.map((s) => s.date.split('T')[0]))].sort().reverse()
  if (sessionDates.length === 0) return 0

  let streak = 1
  for (let i = 0; i < sessionDates.length - 1; i++) {
    const curr = new Date(sessionDates[i])
    const prev = new Date(sessionDates[i + 1])
    const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    if (diff <= daysBetween + restDays) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function getWeeklyVolume(sessions: { date: string; sets: { reps: number; completed: boolean }[] }[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  let thisWeek = 0
  let lastWeek = 0

  for (const s of sessions) {
    const d = new Date(s.date)
    const reps = s.sets.filter((set) => set.completed).reduce((sum, set) => sum + set.reps, 0)
    if (d >= startOfWeek) thisWeek += reps
    else if (d >= startOfLastWeek) lastWeek += reps
  }

  return { thisWeek, lastWeek, delta: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0 }
}

export function Home() {
  const navigate = useNavigate()
  const user = useUserStore()
  const sessions = useSessionStore((s) => s.sessions)
  const getActiveUserProgram = useProgramStore((s) => s.getActiveUserProgram)
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)

  const getPlanByIdFn = usePlanStore((s) => s.getPlanById)

  const activeUp = getActiveUserProgram()
  const activeProgram = activeUp ? getProgramById(activeUp.programId) : undefined

  const pendingSession = (() => {
    try {
      const raw = sessionStorage.getItem('calitrack-active-session')
      if (!raw) return null
      const data = JSON.parse(raw)
      return data as { sessionId: string; planId?: string; programId?: string; programDayId?: string; startTime: number }
    } catch { return null }
  })()

  const currentDay = activeProgram && activeUp
    ? activeProgram.weeks
        .find((w) => w.weekNumber === activeUp.currentWeek)
        ?.days.find((d) => d.dayNumber === activeUp.currentDay)
    : undefined

  const streak = getStreak(sessions, user.trainingDaysPerWeek)
  const volume = getWeeklyVolume(sessions)
  const lastSession = sessions[0]
  const lastPlanId = lastSession?.planId

  return (
    <div className="px-4 pt-6 pb-4">
      <Coachmarks />

      {/* Resume active session banner */}
      {pendingSession && (
        <button
          type="button"
          onClick={() => {
            const state: Record<string, string | boolean> = {}
            if (pendingSession.planId) state.planId = pendingSession.planId
            if (pendingSession.programId) state.programId = pendingSession.programId
            if (pendingSession.programDayId) state.programDayId = pendingSession.programDayId
            if (!pendingSession.planId && !pendingSession.programId) state.free = true
            navigate(`/log/${pendingSession.sessionId}`, { state })
          }}
          className="w-full p-4 rounded-2xl bg-[var(--color-accent-amber)]/10 border border-[var(--color-accent-amber)]/25 flex items-center gap-3 mb-1 active:scale-[0.99] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-amber)]/20 flex items-center justify-center shrink-0">
            <RotateCcw size={18} className="text-[var(--color-accent-amber)]" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-accent-amber)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Session in progress
            </p>
            <p className="text-xs text-[var(--color-muted)] truncate">
              {pendingSession.planId
                ? getPlanByIdFn(pendingSession.planId)?.name ?? 'Plan session'
                : pendingSession.programId
                  ? 'Program session'
                  : 'Free session'}
              {' · '}Started {Math.round((Date.now() - pendingSession.startTime) / 60000)}min ago
            </p>
          </div>
          <ChevronRight size={18} className="text-[var(--color-accent-amber)] shrink-0" />
        </button>
      )}

      <div className="space-y-5 stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back,
          </p>
          <h1 className="text-[1.65rem] leading-tight font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {user.name || 'Athlete'}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="w-11 h-11 rounded-2xl card-surface flex items-center justify-center text-[var(--color-muted)] transition-[transform,box-shadow,color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[var(--color-fg)] active:scale-95"
          aria-label="Settings"
        >
          <Settings size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Today's Program Day */}
      {currentDay && activeProgram && activeUp && (
        <div className="p-5 card-surface relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
          />
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[var(--color-primary)] font-medium uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeProgram.name} · Week {activeUp.currentWeek}
              </p>
              <p className="text-lg font-semibold mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {currentDay.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-muted)]">{currentDay.exercises.length} exercises</p>
            </div>
          </div>
          <div className="text-xs text-[var(--color-muted)] mb-3 space-y-0.5">
            {currentDay.exercises.slice(0, 3).map((e, i) => (
              <p key={i}>{getExerciseById(e.exerciseId)?.name ?? 'Unknown'} · {e.targetSets}×{e.targetReps}</p>
            ))}
            {currentDay.exercises.length > 3 && (
              <p>+{currentDay.exercises.length - 3} more</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/log/new', { state: { programDayId: currentDay.id, programId: activeProgram.id } })}
            className="btn-press relative w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-primary)_55%,transparent)] hover:bg-[var(--color-primary-hover)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Play size={16} fill="currentColor" className="opacity-95" /> Start Today&apos;s Session
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 card-surface">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-[var(--color-accent-amber)]" />
            <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-heading)' }}>Streak</p>
          </div>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{streak}</p>
          <p className="text-xs text-[var(--color-muted)]">training days</p>
        </div>
        <div className="p-4 card-surface">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[var(--color-primary)]" />
            <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-heading)' }}>Weekly Volume</p>
          </div>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{volume.thisWeek.toLocaleString()}</p>
          <p className="text-xs text-[var(--color-muted)]">
            reps {volume.delta !== 0 && (
              <span className={volume.delta > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent-red)]'}>
                {volume.delta > 0 ? '+' : ''}{volume.delta}%
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick Start */}
      <button
        type="button"
        onClick={() => navigate('/log/new', lastPlanId ? { state: { planId: lastPlanId } } : undefined)}
        className="group card-surface-interactive w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] flex items-center justify-center ring-1 ring-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition-transform duration-[200ms] ease-out group-hover:scale-105">
            <Play size={18} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Quick Start</p>
            <p className="text-xs text-[var(--color-muted)]">
              {lastPlanId ? 'Resume last workout' : 'Start a new session'}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--color-muted)] transition-transform duration-[200ms] ease-out group-hover:translate-x-0.5" />
      </button>

      {/* Last Session */}
      {lastSession && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/session/${lastSession.id}`) } }}
          className="card-surface-interactive p-4 cursor-pointer"
          onClick={() => navigate(`/session/${lastSession.id}`)}
        >
          <p className="text-xs text-[var(--color-muted)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Last Session</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {new Date(lastSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {Math.round(lastSession.duration / 60)}min · {lastSession.sets.filter((s) => s.completed).length} sets · {lastSession.sets.filter((s) => s.completed).reduce((a, s) => a + s.reps, 0)} reps
              </p>
            </div>
            {lastSession.mood && (
              <span className="text-xl">{MOOD_MAP[lastSession.mood].emoji}</span>
            )}
          </div>
          {lastSession.prs.length > 0 && (
            <div className="mt-2 flex gap-1">
              {lastSession.prs.map((pr) => (
                <span key={pr} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">
                  PR
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
