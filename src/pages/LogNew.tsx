import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgramStore } from '../stores/programStore'
import { ArrowLeft, Dumbbell, Play, BookOpen, ChevronRight } from 'lucide-react'

export function LogNew() {
  const navigate = useNavigate()
  const location = useLocation()
  const programs = useProgramStore((s) => s.getAllPrograms)()
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const getActiveUserProgram = useProgramStore((s) => s.getActiveUserProgram)
  const redirectedRef = useRef(false)

  const state = location.state as { programDayId?: string; programId?: string } | null

  useEffect(() => {
    if (redirectedRef.current) return
    if (state?.programDayId && state?.programId) {
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
        className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 mb-3 hover:bg-[var(--color-surface-hover)] active:scale-[0.99] transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center shrink-0">
          <Dumbbell size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="text-left flex-1 min-w-0">
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
          className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 mb-3 hover:bg-[var(--color-surface-hover)] active:scale-[0.99] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-amber)]/15 flex items-center justify-center shrink-0">
            <Play size={18} className="text-[var(--color-accent-amber)]" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>{currentDay.label}</p>
            <p className="text-xs text-[var(--color-muted)] truncate">{activeProgram.name} · Week {activeUp!.currentWeek}</p>
          </div>
        </button>
      )}

      {/* Programs */}
      {programs.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-4 mb-2">
            <p className="text-sm font-medium text-[var(--color-muted)]">From a program:</p>
            <button
              onClick={() => navigate('/programs/new')}
              className="text-xs text-[var(--color-primary)] font-semibold"
            >
              + New
            </button>
          </div>
          <div className="space-y-2">
            {programs.map((prog) => (
              <button
                key={prog.id}
                onClick={() => navigate(`/programs/${prog.id}`)}
                className="w-full p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <BookOpen size={15} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{prog.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {prog.daysPerWeek} days/week · {prog.durationWeeks}w
                  </p>
                </div>
                <ChevronRight size={16} className="text-[var(--color-muted)] shrink-0" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
