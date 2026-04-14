import { useNavigate } from 'react-router-dom'
import { useProgramStore } from '../stores/programStore'
import { ChevronRight, CheckCircle, Pause, Play } from 'lucide-react'

export function Programs() {
  const navigate = useNavigate()
  const programs = useProgramStore((s) => s.getAllPrograms)()
  const userPrograms = useProgramStore((s) => s.userPrograms)
  const getActiveUserProgram = useProgramStore((s) => s.getActiveUserProgram)
  const pauseProgram = useProgramStore((s) => s.pauseProgram)
  const resumeProgram = useProgramStore((s) => s.resumeProgram)

  const activeUp = getActiveUserProgram()

  function getEnrollment(programId: string) {
    return userPrograms.find((up) => up.programId === programId && up.status !== 'completed')
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)' }}>Programs</h1>

      {/* Active enrollment */}
      {activeUp && (() => {
        const prog = programs.find((p) => p.id === activeUp.programId)
        if (!prog) return null
        const totalDays = prog.weeks.reduce((a, w) => a + w.days.length, 0)
        const completedPct = Math.round((activeUp.completedDays.length / totalDays) * 100)
        return (
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-[var(--color-primary)] font-medium uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                  Active Program
                </p>
                <p className="text-lg font-semibold mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{prog.name}</p>
              </div>
              <button
                onClick={() => pauseProgram(activeUp.id)}
                className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
                aria-label="Pause program"
              >
                <Pause size={18} />
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-3">
              Week {activeUp.currentWeek} · Day {activeUp.currentDay} · {completedPct}% complete
            </p>
            <div className="w-full h-2 rounded-full bg-[var(--color-bg)] overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${completedPct}%` }}
              />
            </div>
            <button
              onClick={() => navigate(`/programs/${prog.id}`)}
              className="text-sm text-[var(--color-primary)] font-medium"
            >
              View details →
            </button>
          </div>
        )
      })()}

      {/* Paused programs */}
      {userPrograms
        .filter((up) => up.status === 'paused')
        .map((up) => {
          const prog = programs.find((p) => p.id === up.programId)
          if (!prog) return null
          return (
            <div key={up.id} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{prog.name}</p>
                <p className="text-xs text-[var(--color-muted)]">Paused · Week {up.currentWeek}</p>
              </div>
              <button
                onClick={() => resumeProgram(up.id)}
                className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                aria-label="Resume"
              >
                <Play size={18} />
              </button>
            </div>
          )
        })}

      {/* Completed */}
      {userPrograms
        .filter((up) => up.status === 'completed')
        .map((up) => {
          const prog = programs.find((p) => p.id === up.programId)
          if (!prog) return null
          return (
            <div key={up.id} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-3 flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{prog.name}</p>
                <p className="text-xs text-[var(--color-muted)]">Completed</p>
              </div>
              <CheckCircle size={18} className="text-[var(--color-primary)]" />
            </div>
          )
        })}

      {/* Browse programs */}
      <h2 className="text-lg font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>All Programs</h2>
      <div className="space-y-3">
        {programs.map((prog) => {
          const enrollment = getEnrollment(prog.id)
          return (
            <button
              key={prog.id}
              onClick={() => navigate(`/programs/${prog.id}`)}
              className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{prog.name}</p>
                  {enrollment && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                      {enrollment.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2">{prog.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    prog.difficulty === 'beginner'
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      : prog.difficulty === 'intermediate'
                        ? 'bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]'
                        : 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'
                  }`}>
                    {prog.difficulty}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">{prog.durationWeeks}w · {prog.daysPerWeek}d/w</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[var(--color-muted)] ml-2 flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
