import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePlanStore } from '../stores/planStore'
import { useProgramStore } from '../stores/programStore'
import { ArrowLeft, Dumbbell, Play } from 'lucide-react'

export function LogNew() {
  const navigate = useNavigate()
  const location = useLocation()
  const plans = usePlanStore((s) => s.plans)
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const getActiveUserProgram = useProgramStore((s) => s.getActiveUserProgram)
  const redirectedRef = useRef(false)

  const state = location.state as { planId?: string; programDayId?: string; programId?: string } | null

  useEffect(() => {
    if (redirectedRef.current) return
    if (state?.planId) {
      redirectedRef.current = true
      const sessionId = crypto.randomUUID()
      navigate(`/log/${sessionId}`, { state: { planId: state.planId }, replace: true })
    } else if (state?.programDayId && state?.programId) {
      redirectedRef.current = true
      const sessionId = crypto.randomUUID()
      navigate(`/log/${sessionId}`, {
        state: { programId: state.programId, programDayId: state.programDayId },
        replace: true,
      })
    }
  }, [state, navigate])

  const activeUp = getActiveUserProgram()
  const activeProgram = activeUp ? getProgramById(activeUp.programId) : undefined
  const currentDay = activeProgram
    ? activeProgram.weeks
        .find((w) => w.weekNumber === activeUp!.currentWeek)
        ?.days.find((d) => d.dayNumber === activeUp!.currentDay)
    : undefined

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Start Session</h1>
      </div>

      {/* Free session */}
      <button
        onClick={() => {
          const id = crypto.randomUUID()
          navigate(`/log/${id}`, { state: { free: true } })
        }}
        className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 mb-4 hover:bg-[var(--color-surface-hover)] active:scale-[0.99] transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
          <Dumbbell size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Free Session</p>
          <p className="text-xs text-[var(--color-muted)]">Add exercises on the fly</p>
        </div>
      </button>

      {/* Today's program day */}
      {currentDay && activeProgram && (
        <button
          onClick={() => {
            const id = crypto.randomUUID()
            navigate(`/log/${id}`, { state: { programId: activeProgram.id, programDayId: currentDay.id } })
          }}
          className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 mb-4 hover:bg-[var(--color-surface-hover)] active:scale-[0.99] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-amber)]/15 flex items-center justify-center">
            <Play size={18} className="text-[var(--color-accent-amber)]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{currentDay.label}</p>
            <p className="text-xs text-[var(--color-muted)]">{activeProgram.name} · Week {activeUp!.currentWeek}</p>
          </div>
        </button>
      )}

      {/* Plans */}
      {plans.length > 0 && (
        <>
          <p className="text-sm font-medium text-[var(--color-muted)] mt-4 mb-2">From a plan:</p>
          <div className="space-y-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  const id = crypto.randomUUID()
                  navigate(`/log/${id}`, { state: { planId: plan.id } })
                }}
                className="w-full p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <p className="text-sm font-medium">{plan.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{plan.exercises.length} exercises</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
