import { useNavigate } from 'react-router-dom'
import { usePlanStore } from '../stores/planStore'
import { useSessionStore } from '../stores/sessionStore'
import { Plus, ChevronRight, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function Plans() {
  const navigate = useNavigate()
  const plans = usePlanStore((s) => s.plans)
  const deletePlan = usePlanStore((s) => s.deletePlan)
  const sessions = useSessionStore((s) => s.sessions)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function lastPerformed(planId: string): string {
    const s = sessions.find((s) => s.planId === planId)
    if (!s) return 'Never'
    return new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>My Plans</h1>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--color-muted)] mb-4">No plans yet. Create your first workout plan.</p>
          <button
            onClick={() => navigate('/plans/new')}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                  {plan.name}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {plan.exercises.length} exercises · Last: {lastPerformed(plan.id)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(plan.id) }}
                  className="p-2 rounded-lg hover:bg-[var(--color-accent-red)]/10 text-[var(--color-muted)] hover:text-[var(--color-accent-red)] transition-colors"
                  aria-label="Delete plan"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={18} className="text-[var(--color-muted)]" />
              </div>

              {confirmDelete === plan.id && (
                <div className="absolute inset-0 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center gap-3 z-10">
                  <p className="text-sm">Delete this plan?</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); setConfirmDelete(null) }}
                    className="px-4 py-2 bg-[var(--color-accent-red)] text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(null) }}
                    className="px-4 py-2 bg-[var(--color-bg)] rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/plans/new')}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all z-40"
        aria-label="Create new plan"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
