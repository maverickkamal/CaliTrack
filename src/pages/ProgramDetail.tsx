import { useParams, useNavigate } from 'react-router-dom'
import { useProgramStore } from '../stores/programStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { ArrowLeft, Play, CheckCircle, Pencil } from 'lucide-react'

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram)
  const userPrograms = useProgramStore((s) => s.userPrograms)
  const isBuiltIn = useProgramStore((s) => s.isBuiltIn)
  const hasOverride = useProgramStore((s) => s.hasOverride)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)

  const program = getProgramById(programId!)
  const enrollment = userPrograms.find((up) => up.programId === programId && up.status !== 'completed')

  if (!program) return (
    <div className="p-6 text-center">
      <p className="text-[var(--color-muted)]">Program not found</p>
      <button onClick={() => navigate('/programs')} className="mt-4 text-[var(--color-primary)]">Back</button>
    </div>
  )

  const builtIn = isBuiltIn(program.id)
  const overridden = hasOverride(program.id)

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/programs')} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1 truncate" style={{ fontFamily: 'var(--font-display)' }}>{program.name}</h1>
        <button
          onClick={() => navigate(`/programs/${program.id}/edit`)}
          className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/12 text-[var(--color-primary)] text-xs font-semibold hover:bg-[var(--color-primary)]/20 transition-colors flex items-center gap-1 shrink-0"
          aria-label="Edit program"
        >
          <Pencil size={14} /> Edit
        </button>
      </div>

      {program.description && (
        <p className="text-sm text-[var(--color-muted)] mb-4">{program.description}</p>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <span className={`text-xs px-3 py-1 rounded-full capitalize ${
          program.difficulty === 'beginner'
            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
            : program.difficulty === 'intermediate'
              ? 'bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]'
              : 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'
        }`}>
          {program.difficulty}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
          {program.durationWeeks} weeks
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
          {program.daysPerWeek} days/week
        </span>
        {!builtIn && (
          <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">
            custom
          </span>
        )}
        {builtIn && overridden && (
          <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-accent-amber)]/15 text-[var(--color-accent-amber)]">
            edited
          </span>
        )}
      </div>

      {!enrollment && (
        <button
          onClick={() => { enrollInProgram(program.id); navigate('/programs') }}
          className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold mb-6 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
          style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
        >
          Start Program
        </button>
      )}

      {/* Week breakdown */}
      <div className="space-y-6">
        {program.weeks.slice(0, 2).map((week) => (
          <div key={week.weekNumber}>
            <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Week {week.weekNumber}
            </h3>
            <div className="space-y-2">
              {week.days.map((day) => {
                const isCompleted = enrollment?.completedDays.includes(day.id)
                const isCurrent = enrollment && enrollment.currentWeek === week.weekNumber && enrollment.currentDay === day.dayNumber
                return (
                  <div
                    key={day.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      isCurrent
                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    } ${isCompleted ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <p className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-heading)' }}>{day.label}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted && <CheckCircle size={16} className="text-[var(--color-primary)]" />}
                        <button
                          onClick={() => navigate('/log/new', { state: { programId: program.id, programDayId: day.id } })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium"
                        >
                          <Play size={12} fill="white" /> Start
                        </button>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      {day.exercises.map((e, i) => (
                        <p key={i} className="text-xs text-[var(--color-muted)]">
                          {getExerciseById(e.exerciseId)?.name ?? 'Unknown'} · {e.targetSets}×{e.targetReps}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {program.weeks.length > 2 && (
          <p className="text-sm text-[var(--color-muted)] text-center">
            +{program.weeks.length - 2} more weeks (same structure)
          </p>
        )}
      </div>
    </div>
  )
}
