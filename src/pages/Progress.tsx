import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { usePlanStore } from '../stores/planStore'
import { MOOD_MAP } from '../types'
import { ChevronRight, Trophy } from 'lucide-react'
import { useState } from 'react'

export function Progress() {
  const navigate = useNavigate()
  const sessions = useSessionStore((s) => s.sessions)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)
  const getPlanById = usePlanStore((s) => s.getPlanById)
  const [tab, setTab] = useState<'sessions' | 'exercises'>('sessions')

  const exerciseIds = [...new Set(sessions.flatMap((s) => s.sets.map((set) => set.exerciseId)))]

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Progress</h1>

      <div className="flex gap-1 bg-[var(--color-surface)] rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab('sessions')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'sessions' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setTab('exercises')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'exercises' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
          }`}
        >
          Exercises
        </button>
      </div>

      {tab === 'sessions' && (
        <div className="space-y-2">
          {sessions.length === 0 && (
            <p className="text-center text-[var(--color-muted)] py-12">No sessions yet. Complete a workout to see your history.</p>
          )}
          {sessions.map((s) => {
            const plan = s.planId ? getPlanById(s.planId) : undefined
            const completedSets = s.sets.filter((set) => set.completed)
            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => navigate(`/session/${s.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                        {plan?.name ?? 'Free Session'}
                      </p>
                      {s.mood && <span className="text-sm">{MOOD_MAP[s.mood].emoji}</span>}
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}{Math.round(s.duration / 60)}min
                      {' · '}{completedSets.length} sets
                      {' · '}{completedSets.reduce((a, set) => a + set.reps, 0)} reps
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.prs.length > 0 && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">
                        <Trophy size={10} /> PR
                      </span>
                    )}
                    <ChevronRight size={16} className="text-[var(--color-muted)]" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'exercises' && (
        <div className="space-y-2">
          {exerciseIds.length === 0 && (
            <p className="text-center text-[var(--color-muted)] py-12">No exercise data yet.</p>
          )}
          {exerciseIds.map((exId) => {
            const info = getExerciseById(exId)
            const allSets = sessions.flatMap((s) => s.sets.filter((set) => set.exerciseId === exId && set.completed))
            const maxReps = allSets.length > 0 ? Math.max(...allSets.map((s) => s.reps)) : 0
            const totalSessions = sessions.filter((s) => s.sets.some((set) => set.exerciseId === exId)).length
            const hasPR = sessions.some((s) => s.prs.includes(exId))
            return (
              <button
                key={exId}
                onClick={() => navigate(`/progress/${exId}`)}
                className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{info?.name ?? 'Unknown'}</p>
                    {hasPR && <Trophy size={12} className="text-[var(--color-accent-amber)]" />}
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">
                    Best: {maxReps} reps · {totalSessions} sessions
                  </p>
                </div>
                <ChevronRight size={16} className="text-[var(--color-muted)]" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
