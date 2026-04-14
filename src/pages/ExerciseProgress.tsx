import { useParams, useNavigate } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { ArrowLeft, Trophy } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export function ExerciseProgress() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const navigate = useNavigate()
  const sessions = useSessionStore((s) => s.getSessionsByExercise)(exerciseId!)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)

  const exercise = getExerciseById(exerciseId!)

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxRepsData = sortedSessions.map((s) => {
    const sets = s.sets.filter((set) => set.exerciseId === exerciseId && set.completed)
    const maxR = sets.length > 0 ? Math.max(...sets.map((set) => set.reps)) : 0
    return {
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      maxReps: maxR,
    }
  })

  const volumeData = sortedSessions.map((s) => {
    const sets = s.sets.filter((set) => set.exerciseId === exerciseId && set.completed)
    const vol = sets.reduce((a, set) => a + set.reps, 0)
    return {
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: vol,
    }
  })

  const loadData = sortedSessions
    .map((s) => {
      const sets = s.sets.filter((set) => set.exerciseId === exerciseId && set.completed && set.weight != null && set.weight > 0)
      if (sets.length === 0) return null
      const maxLoad = Math.max(...sets.map((set) => set.weight! * (1 + set.reps / 30)))
      return {
        date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        estMax: Math.round(maxLoad * 10) / 10,
      }
    })
    .filter(Boolean)

  const prSessions = sessions.filter((s) => s.prs.includes(exerciseId!))

  const allBestReps = sessions.length > 0
    ? Math.max(...sessions.flatMap((s) => s.sets.filter((set) => set.exerciseId === exerciseId && set.completed).map((set) => set.reps)))
    : 0

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{exercise?.name ?? 'Exercise'}</h1>
          <p className="text-xs text-[var(--color-muted)] capitalize">{exercise?.movementType} · {exercise?.difficulty}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{allBestReps}</p>
          <p className="text-xs text-[var(--color-muted)]">Best Reps</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{sessions.length}</p>
          <p className="text-xs text-[var(--color-muted)]">Sessions</p>
        </div>
      </div>

      {maxRepsData.length >= 2 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Max Reps</h3>
          <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={maxRepsData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="maxReps" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {volumeData.length >= 2 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Volume per Session</h3>
          <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={volumeData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="volume" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loadData.length >= 2 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Estimated Max Load</h3>
          <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={loadData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="estMax" stroke="var(--color-accent-amber)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-accent-amber)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {sessions.length < 2 && (
        <p className="text-center text-[var(--color-muted)] text-sm py-8">
          Complete at least 2 sessions with this exercise to see charts.
        </p>
      )}

      {prSessions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Trophy size={14} className="text-[var(--color-accent-amber)]" /> PR History
          </h3>
          <div className="space-y-2">
            {prSessions.map((s) => {
              const bestReps = Math.max(...s.sets.filter((set) => set.exerciseId === exerciseId && set.completed).map((set) => set.reps), 0)
              return (
                <div key={s.id} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                  <p className="text-sm">
                    {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-accent-amber)]">{bestReps} reps</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
