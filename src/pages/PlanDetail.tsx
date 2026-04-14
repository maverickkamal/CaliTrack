import { useNavigate, useParams } from 'react-router-dom'
import { usePlanStore } from '../stores/planStore'
import { useSessionStore } from '../stores/sessionStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { ArrowLeft, Play, Edit } from 'lucide-react'

export function PlanDetail() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const plan = usePlanStore((s) => s.getPlanById)(planId!)
  const sessions = useSessionStore((s) => s.getSessionsByPlan)(planId!)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)

  if (!plan) return (
    <div className="p-6 text-center">
      <p className="text-[var(--color-muted)]">Plan not found</p>
      <button onClick={() => navigate('/plans')} className="mt-4 text-[var(--color-primary)]">Back to Plans</button>
    </div>
  )

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/plans')} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1" style={{ fontFamily: 'var(--font-display)' }}>{plan.name}</h1>
        <button onClick={() => navigate(`/plans/${plan.id}/edit`)} className="p-2" aria-label="Edit">
          <Edit size={18} className="text-[var(--color-muted)]" />
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {plan.exercises.map((ex, i) => {
          const info = getExerciseById(ex.exerciseId)
          return (
            <div key={i} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{info?.name ?? 'Unknown'}</p>
                <p className="text-xs text-[var(--color-muted)]">{ex.targetSets} sets × {ex.targetReps}</p>
              </div>
              <p className="text-xs text-[var(--color-muted)]">{ex.restSeconds}s rest</p>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/log/new', { state: { planId: plan.id } })}
        className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all mb-6"
        style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
      >
        <Play size={18} fill="white" /> Start Session
      </button>

      {sessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>History</h2>
          <div className="space-y-2">
            {sessions.slice(0, 10).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)]"
                onClick={() => navigate(`/session/${s.id}`)}
              >
                <p className="text-sm font-medium">
                  {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {Math.round(s.duration / 60)}min · {s.sets.filter((ss) => ss.completed).length} sets
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
