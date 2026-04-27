import { useParams, useNavigate } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { useProgramStore } from '../stores/programStore'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { MOOD_MAP } from '../types'
import { useState } from 'react'

export function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const session = useSessionStore((s) => s.getSessionById)(sessionId!)
  const deleteSession = useSessionStore((s) => s.deleteSession)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!session) return (
    <div className="p-6 text-center">
      <p className="text-[var(--color-muted)]">Session not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-[var(--color-primary)]">Go back</button>
    </div>
  )

  const program = session.programId ? getProgramById(session.programId) : undefined
  const programDay = program && session.programDayId
    ? program.weeks.flatMap((w) => w.days).find((d) => d.id === session.programDayId)
    : undefined
  const sessionLabel = programDay?.label ?? program?.name ?? 'Free Session'
  const exerciseIds = [...new Set(session.sets.map((s) => s.exerciseId))]

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {sessionLabel}
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 text-[var(--color-muted)] hover:text-[var(--color-accent-red)]"
          aria-label="Delete session"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {showConfirm && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-accent-red)]/30 mb-4 flex items-center justify-between">
          <p className="text-sm">Delete this session?</p>
          <div className="flex gap-2">
            <button onClick={() => { deleteSession(session.id); navigate(-1) }} className="px-3 py-1.5 bg-[var(--color-accent-red)] text-white rounded-lg text-sm">Delete</button>
            <button onClick={() => setShowConfirm(false)} className="px-3 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>{Math.round(session.duration / 60)}m</p>
          <p className="text-xs text-[var(--color-muted)]">Duration</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>{session.sets.filter((s) => s.completed).length}</p>
          <p className="text-xs text-[var(--color-muted)]">Sets</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {session.sets.filter((s) => s.completed).reduce((a, s) => a + s.reps, 0)}
          </p>
          <p className="text-xs text-[var(--color-muted)]">Reps</p>
        </div>
      </div>

      {session.mood && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">{MOOD_MAP[session.mood].emoji}</span>
          <span className="text-sm text-[var(--color-muted)]">{MOOD_MAP[session.mood].label}</span>
        </div>
      )}

      {session.prs.length > 0 && (
        <div className="p-3 rounded-xl bg-[var(--color-accent-amber)]/10 border border-[var(--color-accent-amber)]/30 mb-4">
          <p className="text-sm font-medium text-[var(--color-accent-amber)]" style={{ fontFamily: 'var(--font-heading)' }}>PRs</p>
          {session.prs.map((id) => (
            <p key={id} className="text-sm">{getExerciseById(id)?.name ?? id}</p>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {exerciseIds.map((exId) => {
          const info = getExerciseById(exId)
          const sets = session.sets.filter((s) => s.exerciseId === exId)
          return (
            <div key={exId} className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
              <p className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{info?.name ?? 'Unknown'}</p>
              <div className="space-y-1">
                {sets.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Set {s.setNumber}</span>
                    <span>
                      {s.reps} reps
                      {s.weight != null && s.weight !== 0 && (
                        <span className="text-[var(--color-muted)]"> @ {s.weight > 0 ? `+${s.weight}` : s.weight}kg</span>
                      )}
                      {(!s.weight || s.weight === 0) && <span className="text-[var(--color-muted)]"> BW</span>}
                    </span>
                    <span>{s.completed ? '✓' : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {session.notes && (
        <div className="mt-4 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted)] mb-1">Notes</p>
          <p className="text-sm">{session.notes}</p>
        </div>
      )}
    </div>
  )
}
